<?php

namespace App\Controller;

use App\Repository\MeasurementRepository;
use App\Repository\SequenceRepository;
use App\Services\MeasurementService;
use App\Services\RecordsService;
use App\Security\EntityVoter;
use App\Entity\Measurement;
use App\Entity\Record;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\MeasurementFilterType;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Annotation\Route;

class MeasurementController extends AbstractController
{
    public function __construct(
        private readonly SequenceRepository $sequenceRepository,
        private readonly MeasurementService $measurementService,
        private readonly EntityManagerInterface $entityManager,
        private readonly MeasurementRepository $measurementRepository,
        private readonly RecordsService $recordsService,
        private readonly PaginatorInterface $paginator,
        private readonly ParameterBagInterface $parameterBag,
    ) {}

    #[Route('/{_locale}/measurement/generate-details', name: 'measurementaGenerateDetails')]
    public function fillDetails(): void
    {
        $this->measurementService->generateDetails();
    }

    #[Route('/{_locale}/measurement/{id?}', name: 'measurement', requirements: ['id' => '\d+'])]
    public function edit(Request $request, ?int $id = null): Response
    {
        $user = $this->getUser();

        if ($id !== null) {
            $measurement = $this->measurementService->getMeasurementById($id);
            if ($measurement === null) {
                throw new \Exception("Measurement doesn't exist");
            }

            $this->denyAccessUnlessGranted(EntityVoter::VIEW, $measurement);

            $measurementForm = $this->createForm(MeasurementType::class, $measurement);
            $newRecordForm = $this->createForm(RecordType::class, new Record());

            if ($request->isMethod('POST')) {
                $measurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($measurementForm->isSubmitted() && $measurementForm->isValid()) {
                    $measurement = $measurementForm->getData();

                    if ($measurementForm->has('rawData') && $measurementForm->get('rawData') !== null) {
                        foreach ($measurementForm->get('rawData')->getData() as $file) {
                            $this->measurementService->uploadFile($file, $measurement);
                        }
                    }

                    $this->entityManager->persist($measurement);
                    $this->entityManager->flush();
                }

                if ($newRecordForm->isSubmitted() && $newRecordForm->isValid()) {
                    $record = $newRecordForm->getData();
                    $parentMeasurementId = $newRecordForm->get('parent_id')->getData();
                    $measurement = $this->measurementRepository->find($parentMeasurementId);
                    if ($measurement === null) {
                        throw new \Exception("Measurement doesn't exist");
                    }

                    $record->setMeasurement($measurement);

                    $this->entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file !== null) {
                        $this->measurementService->uploadFile($file, $measurement);
                    }

                    $this->entityManager->flush();

                    return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
                }
            }

            if ($request->query->get('delete_record') !== null) {
                $this->recordsService->deleteRecord($request->query->get('delete_record'));
                return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
            }

            if ($request->query->get('delete_measurement') !== null) {
                $this->measurementService->deleteMeasurement($request->query->get('delete_measurement'));
                return $this->redirectToRoute('measurements');
            }

            return $this->render('measurement/edit.html.twig', [
                'recordForm' => $newRecordForm->createView(),
                'measurement' => $measurement,
                'formMeasurement' => $measurementForm->createView(),
            ]);
        }

        $this->denyAccessUnlessGranted(EntityVoter::VIEW);
        $form = $this->createForm(MeasurementType::class, new Measurement());

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {
                $measurement = $form->getData();
                $measurement->setUser($user);
                $this->entityManager->persist($measurement);
                $this->entityManager->flush();

                return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
            }
        }

        return $this->render('measurement/add.html.twig', [
            'form' => $form->createView()
        ]);
    }

    #[Route('/{_locale}/remove-measurement', name: 'remove_measurement')]
    public function removeMeasurement(Request $request): RedirectResponse
    {
        $this->denyAccessUnlessGranted(EntityVoter::EDIT);

        $id = $request->request->get('id');
        if ($id !== null) {
            $this->measurementService->deleteMeasurement($id);
        }

        return $this->redirectToRoute('measurements');
    }

    #[Route('/{_locale}/measurements', name: 'measurements')]
    public function list(Request $request): Response
    {
        $filter = $this->createForm(MeasurementFilterType::class);
        $filter->handleRequest($request);

        $pagination = $this->paginator->paginate(
            $this->measurementRepository->getPaginatorQuery(
                $filter->getData(),
                $request->query->get('order', 'date'),
                $request->query->get('direction', 'DESC')
            ),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('measurement/list.html.twig', [
            'pagination' => $pagination,
            'filter' => $filter->createView(),
        ]);
    }

    #[Route('/{_locale}/measurement/{id}/download-file', name: 'downloadMeasurementFile', requirements: ['id' => '\d+'])]
    public function downloadFile(Request $request, int $id): BinaryFileResponse
    {
        $entity = $this->measurementRepository->find($id);

        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }

        $filename = $request->query->get('filename');
        $filePath = $this->parameterBag->get('kernel.project_dir') . '/public/' . $entity->getFilesPath() . '/' . $filename;

        return $this->file($filePath, $filename, ResponseHeaderBag::DISPOSITION_ATTACHMENT);
    }

    #[Route('/{_locale}/measurement/{id}/delete-file', name: 'deleteMeasurementFile', requirements: ['id' => '\d+'])]
    public function deleteFile(Request $request, int $id): RedirectResponse
    {
        $entity = $this->measurementRepository->find($id);
        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }

        $filename = $request->request->get('filename');
        if ($filename) {
            $entity->removeFile($filename);
        }

        return $this->redirectToRoute('measurement', ['id' => $id]);
    }
}
