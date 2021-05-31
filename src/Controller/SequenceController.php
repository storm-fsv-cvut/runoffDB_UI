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
use App\Entity\Run;
use App\Entity\RunGroup;
use App\Entity\Sequence;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\RunGroupType;
use App\Form\RunType;
use App\Form\SequenceBasicType;
use App\Form\SequenceFilterType;
use App\Form\SequenceType;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\RecordTypeRepository;
use App\Repository\RunGroupRepository;
use App\Repository\RunRepository;
use App\Repository\SequenceRepository;
use App\Repository\UnitRepository;
use App\Security\EntityVoter;
use App\Services\MeasurementService;
use App\Services\RecordsService;
use App\Services\RunGroupService;
use App\Services\RunService;
use App\Services\SequenceService;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use mysql_xdevapi\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class SequenceController extends AbstractController
{

    /**
     * @Route("/{_locale}/chart-data", name="chartData")
     */
    public function getChartData(RecordsService $recordsService, Request $request): JsonResponse
    {
        $data = $request->get('ids');
        if ($data!=null) {
            return $this->json($recordsService->getChartData($data));
        } else {
            return $this->json(0);
        }
    }

    /**
     * @Route("/{_locale}/add-run-measurement", name="addRunMeasurement")
     */
    public function addRunMeasurement(
        MeasurementRepository $measurementRepository,
        RunRepository $runRepository,
        MeasurementService $measurementService,
        Request $request
    ): JsonResponse {
        $measurement = $measurementRepository->find($request->get('measurement_id'));
        $run = $runRepository->find($request->get('run_id'));
        if ($run === null) {
            throw new \Exception("Run doesn't exist");
        }
        if ($measurement === null) {
            throw new \Exception("measurement doesn't exist");
        }
        $res = $measurementService->switchBelongsToRun($measurement, $run);
        return $this->json($res);
    }

    /**
     * @Route("/{_locale}/validate-file", name="validateFile")
     */
    public function validateFile(RecordsService $recordsService, Request $request): ?JsonResponse
    {
        $file = $request->files;
        if ($file->get('datafile')!==null) {
            return $this->json(
                $recordsService->validateDataFile(
                    $file->get('datafile'),
                    $request->get('skip_first_row', false) == "1",
                    $request->get('first_column_time', false) == "1"
                )
            );
        }

        return null;
    }

    /**
     * @Route("/{_locale}/israinintensityr", name="israinintensityr")
     */
    public function israinintensityr(
        RecordRepository $recordRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): ?RedirectResponse {
        if ($request->get('recordId')!==null) {
            $record = $recordRepository->find($request->get('recordId'));
            if ($record===null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement()!==null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setRainIntensity($record);
                    $entityManager->persist($run);
                    $entityManager->flush();
                }

            }
        }
        if (isset($sequence) && $sequence!==null) {
            return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
        } else {
            return null;
        }
    }

    /**
     * @Route("/{_locale}/isinitmoisturer", name="isinitmoisturer")
     */
    public function isinitmoisturer(
        RecordRepository $recordRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): RedirectResponse {
        $sequence = null;
        if ($request->get('recordId')!==null) {
            $record = $recordRepository->find($request->get('recordId'));
            if ($record===null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement()!==null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setInitMoisture($record);
                    $entityManager->persist($run);
                    $entityManager->flush();
                }
            }
        }
        return $this->redirectToRoute('sequence', ['id' => $sequence!==null ? $sequence->getId() : null]);
    }

    /**
     * @Route("/{_locale}/download-file", name="downloadFile")
     */
    public function downloadFile(RunRepository $runRepository, Request $request, ParameterBagInterface $parameterBag): BinaryFileResponse
    {
        $run = $runRepository->find($request->get('runId'));
        if ($run === null) {
            throw new \Exception("Run doesn't exist");
        }
        $filename = $request->get('filename');
        return BinaryFileResponse::create(
            $parameterBag->get('kernel.project_dir') . "/public/" . $run->getFilesPath() . '/' . $filename
        );
    }

    /**
     * @Route("/{_locale}/delete-file", name="deleteFile")
     */
    public function deleteFile(RunRepository $runRepository, Request $request): ?RedirectResponse
    {
        $run = $runRepository->find($request->get('runId'));
        if ($run === null) {
            throw new \Exception("Run doesn't exist");
        }
        $filename = $request->get('filename');
        $run->removeFile($filename);
        if ($run->getSequence()!==null) {
            return $this->redirectToRoute('sequence', ['id' => $run->getSequence()->getId()]);
        } else {
            return null;
        }
    }

    /**
     * @Route("/{_locale}/sequence/{id}", name="sequence")
     */
    public function edit(
        EntityManagerInterface $entityManager,
        Request $request,
        SequenceService $sequenceService,
        RunService $runService,
        RunRepository $runRepository,
        RunGroupRepository $runGroupRepository,
        MeasurementRepository $measurementRepository,
        MeasurementService $measurementService,
        ParameterBagInterface $parameterBag,
        RecordTypeRepository $recordTypeRepository,
        UnitRepository $unitRepository,
        RecordsService $recordsService,
        RunGroupService $runGroupService,
        int $id = null
    ): Response {
        if ($this->get('security.token_storage')->getToken()===null) {
            throw new \Exception("User token is null");
        }
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if ($id!==null) {
            $sequence = $sequenceService->getSequenceById($id);
            $this->denyAccessUnlessGranted(EntityVoter::VIEW, $sequence);

            $sequenceForm = $this->createForm(SequenceType::class, $sequence);
            $newRunForm = $this->createForm(RunType::class, new Run());
            $newRunGroupForm = $this->createForm(RunGroupType::class, new RunGroup());
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $newRecordForm = $this->createForm(RecordType::class, new Record());


            if ($request->isMethod('POST')) {
                $sequenceForm->handleRequest($request);
                $newRunForm->handleRequest($request);
                $newMesurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);
                $newRunGroupForm->handleRequest($request);

                if ($newRunGroupForm->isSubmitted()) {
                    $runGroupService->addRunGroup($newRunGroupForm, $sequence);
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRunForm->isSubmitted()) {
                    $newRunFormData = $newRunForm->getData();
                    $runGroup = $runGroupRepository->find($newRunForm->get('parent_id')->getData());
                    if ($runGroup===null) {
                        throw new \Exception("runGroup doesn't exist");
                    }
                    $newRunFormData->setRunGroup($runGroup);
                    $entityManager->persist($newRunFormData);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newMesurementForm->isSubmitted()) {
                    $formMeasurementData = $newMesurementForm->getData();
                    $run = $runRepository->find($newMesurementForm->get('parent_id')->getData());
                    if ($run===null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $formMeasurementData->addRun($run);
                    $formMeasurementData->setUser($user);
                    $entityManager->persist($formMeasurementData);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {

                    /**
                     * @var Record
                     */
                    $record = $newRecordForm->getData();
                    $measurement = $measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    if ($measurement===null) {
                        throw new \Exception("Measurement doesn't exist");
                    }
                    $record->setMeasurement($measurement);
                    $entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file!==null) {
                        $runService->uploadFile($file, $measurement->getRuns()->get(0));
                    }
                    $entityManager->flush();

                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($sequenceForm->isSubmitted()) {
                    $partialForm = $sequenceForm->getClickedButton()->getParent();
                    $partialData = $partialForm->getData();

                    if ($partialForm->has('rawData') && $partialForm->get('rawData')!==null) {
                        foreach ($partialForm->get('rawData')->getData() as $file) {
                            $runService->uploadFile($file, $partialData);
                        }
                    }

                    $entityManager->persist($partialData);
                    $entityManager->flush();
                }

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_run')!==null) {
                $run = $entityManager->find(Run::class, $request->get('delete_run'));
                if ($run===null) {
                    throw new \Exception("run doesn't exist");
                }
                foreach ($run->getMeasurements() as $measurement) {
                    foreach ($measurement->getRecords() as $record) {
                        foreach ($record->getData() as $data) {
                            $entityManager->remove($data);
                        }
                        $entityManager->flush();
                        $entityManager->remove($record);
                    }
                    $entityManager->flush();
                    $entityManager->remove($measurement);
                }
                $entityManager->flush();
                $entityManager->remove($run);
                $entityManager->flush();

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }


            if ($request->get('delete_measurement')!==null) {
                $measurementService->deleteMeasurement($request->get('delete_measurement'));
                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_record')!==null) {
                $record = $entityManager->find(Record::class, $request->get('delete_record'));
                if ($record===null) {
                    throw new \Exception("record doesn't exist");
                }
                foreach ($record->getData() as $data) {
                    $entityManager->remove($data);
                }
                $entityManager->flush();
                $entityManager->remove($record);
                $entityManager->flush();

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }


            return $this->render(
                'sequence/edit.html.twig',
                [
                    'header' => $sequenceService->getSequenceHeader($sequence),
                    'runs' => $sequenceService->getRunsArray($sequence),
                    'form' => $sequenceForm->createView(),
                    'sequence' => $sequence,
                    'measurementForm' => $newMesurementForm->createView(),
                    'runForm' => $newRunForm->createView(),
                    'runGroupForm' => $newRunGroupForm->createView(),
                    'runSevice' => $runService,
                    'recordsService' => $recordsService,
                    'recordForm' => $newRecordForm->createView(),
                ]
            );

        } else {
            $form = $this->createForm(SequenceBasicType::class, new Sequence());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $sequence = $form->getData();
                    $sequence->setUser($user);
                    $entityManager->persist($sequence);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }
            }
            return $this->render(
                'sequence/add.html.twig',
                [
                    'form' => $form->createView()
                ]
            );
        }
    }

    /**
     * @Route("/{_locale}/remove-sequence", name="remove_sequence")
     */
    public function removeSequence(Request $request, SequenceRepository $sequenceRepository): RedirectResponse
    {
        $sequenceRepository->setDeleted($request->get('id'));
        return $this->redirectToRoute('sequences');
    }

    /**
     * @Route("/{_locale}/sequences", name="sequences")
     */
    public function list(
        EntityManagerInterface $em,
        PaginatorInterface $paginator,
        Request $request,
        SequenceRepository $sequenceRepository
    ): Response {
        $filter = $this->createForm(SequenceFilterType::class);
        $filter->handleRequest($request);

        $pagination = $paginator->paginate(
            $sequenceRepository->getPaginatorQuery(
                $filter->getData(),
                $request->get('order', 'date'),
                $request->get('direction', 'DESC')
            ),
            $request->query->getInt('page', 1),
            20,
            [PaginatorInterface::DEFAULT_SORT_FIELD_NAME => 'sequence.date',
                PaginatorInterface::DEFAULT_SORT_DIRECTION => 'DESC']
        );
        return $this->render(
            'sequence/list.html.twig',
            ['pagination' => $pagination, 'filter' => $filter->createView()]
        );
    }

    /**
     * @Route("/{_locale}/sequences-overview", name="sequencesOverview")
     */
    public function overview(
        EntityManagerInterface $em,
        Request $request,
        PaginatorInterface $paginator,
        SequenceRepository $sequenceRepository,
        RunService $runService,
        PhenomenonRepository $phenomenonRepository
    ): Response {

        //$sequences = $sequenceRepository->findBy(['deleted' => null], ['date' => 'ASC']);

        $pagination = $paginator->paginate(
            $sequenceRepository->getPaginatorQuery(
                [],
                $request->get('order', 'date'),
                $request->get('direction', 'DESC')
            ),
            $request->query->getInt('page', 1),
            1000,
            [PaginatorInterface::DEFAULT_SORT_FIELD_NAME => 'sequence.date',
                PaginatorInterface::DEFAULT_SORT_DIRECTION => 'DESC']
        );

        return $this->render(
            'sequence/overview.html.twig',
            [
                'pagination' => $pagination,
                'runSevice' => $runService,
                'phenomenonRepository' => $phenomenonRepository,
            ]
        );
    }

}
