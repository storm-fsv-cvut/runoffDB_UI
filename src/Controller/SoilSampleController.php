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

    /**
     * @Route("/{_locale}/sample-chart-data", name="chartDataSoilSample")
     */
    public function getChartData(RecordsService $recordsService, Request $request): JsonResponse
    {
        $data = $request->get('ids');
        if ($data != null) {
            return $this->json($recordsService->getChartData($data));
        } else {
            return $this->json(0);
        }
    }

    /**
     * @Route("/{_locale}/soil-sample/{id}", name="soilSample")
     */
    public function edit(
        SoilSampleService      $soilSampleService,
        Request                $request,
        EntityManagerInterface $entityManager,
        MeasurementRepository  $measurementRepository,
        MeasurementService     $measurementService,
        RecordsService         $recordsService,
        RunService             $runService,
        int                    $id = null
    ): Response {
        if ($this->get('security.token_storage')->getToken() === null) {
            throw new \Exception("User token is null");
        }
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if ($id !== null) {
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $appendMesurementForm = $this->createForm(AppendMeasurementType::class);
            $newRecordForm = $this->createForm(RecordType::class, new Record());
            $soilSample = $soilSampleService->getSoilSampleById($id);
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
                    $entityManager->persist($soilSample);
                    $entityManager->flush();

                    if ($soilSampleForm->has('rawData') && $soilSampleForm->get('rawData') !== null) {
                        foreach ($soilSampleForm->get('rawData')->getData() as $file) {
                            $soilSampleService->uploadFile($file, $soilSampleForm->getData());
                        }
                    }
                }

                if ($newMesurementForm->isSubmitted()) {
                    $measurement = $newMesurementForm->getData();
                    $measurement->addSoilSample($soilSample);
                    $measurement->setUser($user);
                    $entityManager->persist($measurement);
                    $entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }

                if ($appendMesurementForm->isSubmitted()) {
                    $measurementId = $appendMesurementForm->get('measurementId')->getData();
                    $measurement = $measurementRepository->find($measurementId);
                    if ($measurement != null) {
                        $soilSample->addMeasurement($measurement);
                        $entityManager->persist($soilSample);
                        $entityManager->flush();
                    }
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {
                    $record = $newRecordForm->getData();
                    $measurement = $measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    if ($measurement === null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $record->setMeasurement($measurement);

                    $entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file !== null) {
                        $soilSampleService->uploadFile($file, $soilSample);
                    }
                    $entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            if ($request->get('delete_measurement') !== null) {
                $measurementService->deleteMeasurement($request->get('delete_measurement'));
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            if ($request->get('unlink_measurement') !== null) {
                $measurement = $measurementRepository->find($request->get('unlink_measurement'));
                if ($measurement != null) {
                    $soilSample->removeMeasurement($measurement);
                    $entityManager->persist($soilSample);
                    $entityManager->flush();
                }
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            if ($request->get('delete_record') !== null) {
                $record = $entityManager->find(Record::class, $request->get('delete_record'));
                if ($record === null) {
                    throw new \Exception("record doesn't exist");
                }
                foreach ($record->getData() as $data) {
                    $entityManager->remove($data);
                }
                $entityManager->flush();
                $entityManager->remove($record);
                $entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            return $this->render(
                'soilSample/edit.html.twig',
                [
                    'measurementForm' => $newMesurementForm->createView(),
                    'appendMeasurementForm' => $appendMesurementForm->createView(),
                    'recordForm' => $newRecordForm->createView(),
                    'recordsService' => $recordsService,
                    'measurements' => $soilSampleService->getMeasurementsArray($soilSample),
                    'soilSample' => $soilSample,
                    'runService' => $runService,
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
                    $entityManager->persist($soilSample);
                    $entityManager->flush();
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

    /**
     * @Route("/{_locale}/soil-samples", name="soilSamples")
     */
    public function list(
        PaginatorInterface   $paginator,
        SoilSampleRepository $soilSampleRepository,
        Request              $request,
        SoilSampleService    $soilSampleService,
        PhenomenonRepository $phenomenonRepository
    ): Response {

        $filter = $this->createForm(SoilSampleFilterType::class);
        $filter->handleRequest($request);
        $pagination = $paginator->paginate(
            $soilSampleRepository->getPaginatorQuery(
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
                'phenomenonRepository' => $phenomenonRepository,
                'soilSampleService' => $soilSampleService
            ]
        );
    }

    /**
     * @Route("/{_locale}/remove-soil-sample", name="remove_soilsample")
     */
    public function removeSoilSample(Request $request, SoilSampleRepository $soilSampleRepository): RedirectResponse
    {
        $soilSampleRepository->setDeleted($request->get('id'));
        return $this->redirectToRoute('soilSamples');
    }

    /**
     * @Route("/{_locale}/is-moisture", name="ismoisture")
     */
    public function istmoisture(
        RecordRepository       $recordRepository,
        SoilSampleRepository   $soilSampleRepository,
        SoilSampleService      $soilSampleService,
        EntityManagerInterface $entityManager,
        Request                $request
    ): ?RedirectResponse {

        if ($request->get('soilSampleId') !== null) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);
                if ($request->get('recordId') !== null) {
                    $record = $recordRepository->find($request->get('recordId'));
                } else {
                    $record = null;
                }
                $soilSample->setMoisture($record);
                $entityManager->persist($soilSample);
                $entityManager->flush();
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }
        return null;
    }


    /**
     * @Route("/{_locale}/is-texture", name="istexture")
     */
    public function istexture(
        RecordRepository       $recordRepository,
        SoilSampleRepository   $soilSampleRepository,
        SoilSampleService      $soilSampleService,
        EntityManagerInterface $entityManager,
        Request                $request
    ): ?RedirectResponse {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);
                if ($request->get('recordId') !== null) {
                    $record = $recordRepository->find($request->get('recordId'));
                } else {
                    $record = null;
                }
                $soilSample->setTextureRecord($record);
                $entityManager->persist($soilSample);
                $entityManager->flush();
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }
        return null;
    }

    /**
     * @Route("/{_locale}/is-corg", name="iscorg")
     */
    public function iscorg(
        RecordRepository       $recordRepository,
        SoilSampleRepository   $soilSampleRepository,
        SoilSampleService      $soilSampleService,
        EntityManagerInterface $entityManager,
        Request                $request
    ): ?RedirectResponse {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            if ($soilSample !== null) {
                $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);
                if ($request->get('recordId') !== null) {
                    $record = $recordRepository->find($request->get('recordId'));
                } else {
                    $record = null;
                }
                $soilSample->setCorg($record);
                $entityManager->persist($soilSample);
                $entityManager->flush();
                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }
        }
        return null;
    }

    /**
     * @Route("/{_locale}/is-bulkDensity", name="isbulkDensity")
     */
    public function isbulkDensity(
        RecordRepository       $recordRepository,
        SoilSampleRepository   $soilSampleRepository,
        SoilSampleService      $soilSampleService,
        EntityManagerInterface $entityManager,
        Request                $request
    ): ?RedirectResponse {
        if ($request->get('soilSampleId') !== null) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId'));
            $this->denyAccessUnlessGranted(EntityVoter::EDIT, $soilSample);
            if ($request->get('recordId') !== null) {
                $record = $recordRepository->find($request->get('recordId'));
            } else {
                $record = null;
            }
            $soilSample->setBulkDensity($record);
            $entityManager->persist($soilSample);
            $entityManager->flush();
            return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
        }
        return null;
    }

    /**
     * @Route("/{_locale}/soil-samples-overview", name="soilSamplesOverview")
     */
    public function overview(
        EntityManagerInterface $em,
        Request                $request,
        SoilSampleService      $soilSampleService,
        SoilSampleRepository   $soilSampleRepository,
        PhenomenonRepository   $phenomenonRepository
    ): Response {
        $this->denyAccessUnlessGranted(EntityVoter::VIEW);
        $soilSamples = $soilSampleRepository->findBy(["deleted" => null], ['dateSampled' => 'ASC']);
        return $this->render(
            'soilSample/overview.html.twig',
            [
                'soilSamples' => $soilSamples,
                'phenomenonRepository' => $phenomenonRepository,
                'soilSampleService' => $soilSampleService
            ]
        );
    }


    /**
     * @Route("/{_locale}/soil-sample/{id}/download-file", name="downloadSoilSampleFile")
     */
    public function downloadFile(
        RunRepository         $runRepository,
        SoilSampleRepository  $soilSampleRepository,
        Request               $request,
        ParameterBagInterface $parameterBag,
        int                   $id
    ): BinaryFileResponse {
        $entity = $soilSampleRepository->find($id);

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
     * @Route("/{_locale}/soil-sample/{id}/delete-file", name="deleteSoilSampleFile")
     */
    public function deleteFile(
        RunRepository        $runRepository,
        SoilSampleRepository $soilSampleRepository,
        Request              $request,
        int                  $id
    ): ?RedirectResponse {

        $entity = $soilSampleRepository->find($id);
        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }
        $filename = $request->get('filename');
        $entity->removeFile($filename);

        return $this->redirectToRoute('soilSample', ['id' => $id]);
    }
}
