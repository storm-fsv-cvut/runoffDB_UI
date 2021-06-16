<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Repository\SoilSampleRepository;
use Exception;
use App\Entity\Measurement;
use App\Entity\Record;
use App\Entity\Sequence;
use App\Form\MeasurementFilterType;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\SequenceBasicType;
use App\Form\MeasurementBasicType;
use App\Form\SoilSampleFilterType;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\RunRepository;
use App\Repository\SequenceRepository;
use App\Security\EntityVoter;
use App\Services\RecordsService;
use App\Services\MeasurementService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class MeasurementController extends AbstractController {

    /**
     * @Route("/{_locale}/measurement/generate-details", name="measurementaGenerateDetails")
     */
    public function fillDetails(MeasurementService $measurementService):void {
        $measurementService->generateDetails();
    }

    /**
     * @Route("/{_locale}/measurement/{id}", name="measurement")
     */
    public function edit(
        SequenceRepository $sequenceRepository,
        MeasurementService $measurementService,
                         Request $request,
                         EntityManagerInterface $entityManager,
                         MeasurementRepository $measurementRepository,
                         RecordsService $recordsService,
                         int $id = null):Response {
        if ($this->get('security.token_storage')->getToken()===null) {
            throw new \Exception("User token is null");
        }
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if ($id!==null) {
            $newRecordForm = $this->createForm(RecordType::class, new Record());
            $measurement = $measurementService->getMeasurementById($id);
            if ($measurement === null) {
                throw new Exception("Measurement doesnt exists");
            }
            $this->denyAccessUnlessGranted(EntityVoter::VIEW,$measurement);
            $measurementForm = $this->createForm(MeasurementType::class, $measurement);

            if ($request->isMethod('POST')) {
                $measurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($measurementForm->isSubmitted()) {
                    $measurement = $measurementForm->getData();

                    if ($measurementForm->has('rawData') && $measurementForm->get('rawData') !== null) {
                        foreach ($measurementForm->get('rawData')->getData() as $file) {
                            $measurementService->uploadFile($file, $measurementForm->getData());
                        }
                    }

                    $entityManager->persist($measurement);
                    $entityManager->flush();
                }

                if ($newRecordForm->isSubmitted()) {
                    $record = $newRecordForm->getData();
                    $measurement = $measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    if ($measurement===null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $record->setMeasurement($measurement);

                    $entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file!==null) {
                        $measurementService->uploadFile($file, $measurement);
                    }
                    $entityManager->flush();
                    return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
                }
            }
            if ($request->get('delete_record')!==null) {
                $recordsService->deleteRecord($request->get('delete_record'));
                return $this->redirectToRoute('measurement', ['id' => $measurement!==null ? $measurement->getId() : null]);
            }

            if ($request->get('delete_measurement') !== null) {
                $measurementService->deleteMeasurement($request->get('delete_measurement'));
                return $this->redirectToRoute('measurements');
            }

            return $this->render('measurement/edit.html.twig',[
                'recordForm' => $newRecordForm->createView(),
                'measurement'=>$measurement,
                'formMeasurement' => $measurementForm->createView(),
            ]);
        } else {
            $this->denyAccessUnlessGranted(EntityVoter::VIEW);
            $form = $this->createForm(MeasurementType::class, new Measurement());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $measurement = $form->getData();
                    $measurement->setUser($user);
                    $entityManager->persist($measurement);
                    $entityManager->flush();
                    return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
                }
            }

            return $this->render('measurement/add.html.twig', [
                'form' => $form->createView()
            ]);
        }
    }

    /**
     * @Route("/{_locale}/remove-measurement", name="remove_measurement")
     */
    public function removeMeasurement(Request $request,MeasurementService $measurementService): RedirectResponse {
        $this->denyAccessUnlessGranted(EntityVoter::EDIT);
        $measurementService->deleteMeasurement($request->get('id'));
        return $this->redirectToRoute('measurements');
    }

    /**
     * @Route("/{_locale}/measurements", name="measurements")
     */
    public function list(PaginatorInterface $paginator, MeasurementRepository $measurementRepository, Request $request, MeasurementService $measurementService):Response {

        $filter = $this->createForm(MeasurementFilterType::class);
        $filter->handleRequest($request);

        $pagination = $paginator->paginate(
            $measurementRepository->getPaginatorQuery($filter->getData(), $request->get('order','date'), $request->get('direction','DESC')),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('measurement/list.html.twig', ['pagination' => $pagination,'filter'=>$filter->createView()]);
    }

    /**
     * @Route("/{_locale}/measurement/{id}/download-file", name="downloadMeasurementFile")
     */
    public function downloadFile(
        MeasurementRepository $measurementRepository,
        Request $request,
        ParameterBagInterface $parameterBag,
        int $id
    ): BinaryFileResponse {
        $entity = $measurementRepository->find($id);

        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }
        $filename = $request->get('filename');
        $response = BinaryFileResponse::create(
            $parameterBag->get('kernel.project_dir') . "/public/" . $entity->getFilesPath() . '/' . $filename
        );
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename
        );

        return $response;
    }

    /**
     * @Route("/{_locale}/measurement/{id}/delete-file", name="deleteMeasurementFile")
     */
    public function deleteFile(
        MeasurementRepository $measurementRepository,
        Request $request,
        int $id
    ): ?RedirectResponse {

        $entity = $measurementRepository->find($id);
        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }
        $filename = $request->get('filename');
        $entity->removeFile($filename);

        return $this->redirectToRoute('measurement', ['id' => $id]);
    }
}
