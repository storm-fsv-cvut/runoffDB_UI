<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Entity\Measurement;
use App\Entity\Record;
use App\Entity\SoilSample;
use App\Form\AppendMeasurementType;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\SoilSampleBasicType;
use App\Form\SoilSampleFilterType;
use App\Form\SoilSampleType;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\RunRepository;
use App\Repository\SoilSampleRepository;
use App\Security\EntityVoter;
use App\Services\MeasurementService;
use App\Services\RecordsService;
use App\Services\RunService;
use App\Services\SoilSampleService;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class SoilSampleController extends AbstractController
{
    public function __construct(
        private RecordsService $recordsService,
        private SoilSampleService $soilSampleService,
        private EntityManagerInterface $entityManager,
        private MeasurementRepository $measurementRepository,
        private MeasurementService $measurementService,
        private RunService $runService,
        private Security $security,
        private PaginatorInterface $paginator,
        private SoilSampleRepository $soilSampleRepository,
        private PhenomenonRepository $phenomenonRepository,
        private RecordRepository $recordRepository,
        private ParameterBagInterface $parameterBag
    ) {}

    #[Route('/{_locale}/sample-chart-data', name: 'chartDataSoilSample')]
    public function getChartData(Request $request): JsonResponse
    {
        $data = $request->get('ids');
        if ($data !== null) {
            return $this->json($this->recordsService->getChartData($data));
        }

        return $this->json(0);
    }

    #[Route('/{_locale}/soil-sample/{id}', name: 'soilSample')]
    public function edit(Request $request, int $id = null): Response {

        $user = $this->security->getUser();

        if ($id !== null) {
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $appendMesurementForm = $this->createForm(AppendMeasurementType::class);
            $newRecordForm = $this->createForm(RecordType::class, new Record());
            $soilSample = $this->soilSampleService->getSoilSampleById($id);
            $soilSampleForm = $this->createForm(SoilSampleType::class, $soilSample);
            $this->denyAccessUnlessGranted(EntityVoter::VIEW, $soilSample);

            if ($request->isMethod('POST')) {
                $soilSampleForm->handleRequest($request);
                $newMesurementForm->handleRequest($request);
                $appendMesurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($soilSampleForm->isSubmitted()) {
                    $soilSample = $soilSampleForm->getData();
                    if ($soilSample->getPlot()) {
                        $soilSample->setLocality($soilSample->getPlot()->getLocality());
                    }
                    $this->entityManager->persist($soilSample);
                    $this->entityManager->flush();

                    if ($soilSampleForm->has('rawData') && $soilSampleForm->get('rawData') !== null) {
                        foreach ($soilSampleForm->get('rawData')->getData() as $file) {
                            $this->soilSampleService->uploadFile($file, $soilSampleForm->getData());
                        }
                    }
                }

                if ($newMesurementForm->isSubmitted()) {
                    $measurement = $newMesurementForm->getData();
                    $measurement->addSoilSample($soilSample);
                    $measurement->setUser($user);
                    $this->entityManager->persist($measurement);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }

                if ($appendMesurementForm->isSubmitted()) {
                    $measurementId = $appendMesurementForm->get('measurementId')->getData();
                    $measurement = $this->measurementRepository->find($measurementId);
                    if ($measurement != null) {
                        $soilSample->addMeasurement($measurement);
                        $this->entityManager->persist($soilSample);
                        $this->entityManager->flush();
                    }
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {
                    $record = $newRecordForm->getData();
                    $measurement = $this->measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    if ($measurement === null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $record->setMeasurement($measurement);

                    $this->entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file !== null) {
                        $this->soilSampleService->uploadFile($file, $soilSample);
                    }
                    $this->entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            if ($request->get('delete_measurement') !== null) {
                $this->measurementService->deleteMeasurement($request->get('delete_measurement'));
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            if ($request->get('unlink_measurement') !== null) {
                $measurement = $this->measurementRepository->find($request->get('unlink_measurement'));
                if ($measurement != null) {
                    $soilSample->removeMeasurement($measurement);
                    $this->entityManager->persist($soilSample);
                    $this->entityManager->flush();
                }
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            if ($request->get('delete_record') !== null) {
                $record = $this->entityManager->find(Record::class, $request->get('delete_record'));
                if ($record === null) {
                    throw new \Exception("record doesn't exist");
                }
                foreach ($record->getData() as $data) {
                    $this->entityManager->remove($data);
                }
                $this->entityManager->flush();
                $this->entityManager->remove($record);
                $this->entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            return $this->render(
                'soilSample/edit.html.twig',
                [
                    'measurementForm' => $newMesurementForm->createView(),
                    'appendMeasurementForm' => $appendMesurementForm->createView(),
                    'recordForm' => $newRecordForm->createView(),
                    'recordsService' => $this->recordsService,
                    'measurements' => $this->soilSampleService->getMeasurementsArray($soilSample),
                    'soilSample' => $soilSample,
                    'runService' => $this->runService,
                    'form' => $soilSampleForm->createView(),
                ]
            );
        } else {
            $this->denyAccessUnlessGranted(EntityVoter::VIEW);
            $form = $this->createForm(SoilSampleBasicType::class, new SoilSample());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $soilSample = $form->getData();
                    $soilSample->setUser($user);
                    if ($soilSample->getPlot()) {
                        $soilSample->setLocality($soilSample->getPlot()->getLocality());
                    }
                    $this->entityManager->persist($soilSample);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            return $this->render(
                'soilSample/add.html.twig',
                [
                    'form' => $form->createView()
                ]
            );
        }
    }

    #[Route('/{_locale}/soil-samples', name: 'soilSamples')]
    public function list(Request $request): Response
    {
        $filter = $this->createForm(SoilSampleFilterType::class);
        $filter->handleRequest($request);

        $pagination = $this->paginator->paginate(
            $this->soilSampleRepository->getPaginatorQuery(
                $filter->getData(),
                $request->get('order', 'date'),
                $request->get('direction', 'DESC')
            ),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render(
            'soilSample/list.html.twig',
            [
                'pagination' => $pagination,
                'filter' => $filter->createView(),
                'phenomenonRepository' => $this->phenomenonRepository,
                'soilSampleService' => $this->soilSampleService,
            ]
        );
    }

    #[Route('/{_locale}/remove-soil-sample', name: 'remove_soilsample')]
    public function removeSoilSample(Request $request): RedirectResponse
    {
        $this->soilSampleRepository->setDeleted($request->get('id'));
        return $this->redirectToRoute('soilSamples');
    }

    #[Route('/{_locale}/is-moisture', name: 'ismoisture')]
    public function istmoisture(Request $request): ?RedirectResponse
    {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $this->soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);

                $record = $request->get('recordId') !== null
                    ? $this->recordRepository->find($request->get('recordId'))
                    : null;

                $soilSample->setMoisture($record);
                $this->entityManager->persist($soilSample);
                $this->entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }

        return null;
    }

    #[Route('/{_locale}/is-texture', name: 'istexture')]
    public function istexture(Request $request): ?RedirectResponse
    {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $this->soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);

                $record = $request->get('recordId') !== null
                    ? $this->recordRepository->find($request->get('recordId'))
                    : null;

                $soilSample->setTextureRecord($record);
                $this->entityManager->persist($soilSample);
                $this->entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }

        return null;
    }

    #[Route('/{_locale}/is-corg', name: 'iscorg')]
    public function iscorg(Request $request): ?RedirectResponse
    {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $this->soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);

                $record = $request->get('recordId') !== null
                    ? $this->recordRepository->find($request->get('recordId'))
                    : null;

                $soilSample->setCorg($record);
                $this->entityManager->persist($soilSample);
                $this->entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }

        return null;
    }

    #[Route('/{_locale}/is-bulkDensity', name: 'isbulkDensity')]
    public function isbulkDensity(Request $request): ?RedirectResponse
    {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $this->soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);

            $record = $request->get('recordId') !== null
                ? $this->recordRepository->find($request->get('recordId'))
                : null;

            $soilSample->setBulkDensity($record);
            $this->entityManager->persist($soilSample);
            $this->entityManager->flush();

            return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
        }

        return null;
    }

    #[Route('/{_locale}/soil-samples-overview', name: 'soilSamplesOverview')]
    public function overview(Request $request): Response
    {
        $this->denyAccessUnlessGranted(EntityVoter::VIEW);

        $soilSamples = $this->soilSampleRepository->findBy(['deleted' => null], ['dateSampled' => 'ASC']);

        return $this->render(
            'soilSample/overview.html.twig',
            [
                'soilSamples' => $soilSamples,
                'phenomenonRepository' => $this->phenomenonRepository,
                'soilSampleService' => $this->soilSampleService,
            ]
        );
    }


    #[Route('/{_locale}/soil-sample/{id}/download-file', name: 'downloadSoilSampleFile')]
    public function downloadFile(Request $request, int $id): BinaryFileResponse
    {
        $entity = $this->soilSampleRepository->find($id);

        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }

        $filename = $request->get('filename');
        $path = $this->parameterBag->get('kernel.project_dir') . "/public/" . $entity->getFilesPath() . '/' . $filename;

        $response = new BinaryFileResponse($path);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename
        );

        return $response;
    }

    #[Route('/{_locale}/soil-sample/{id}/delete-file', name: 'deleteSoilSampleFile')]
    public function deleteFile(Request $request, int $id): ?RedirectResponse
    {
        $entity = $this->soilSampleRepository->find($id);
        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }

        $filename = $request->get('filename');
        $entity->removeFile($filename);

        return $this->redirectToRoute('soilSample', ['id' => $id]);
    }
}
