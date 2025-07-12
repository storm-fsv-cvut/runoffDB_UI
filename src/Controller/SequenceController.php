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
use App\Form\AppendMeasurementType;
use App\Form\AppendRecordType;
use App\Form\DeleteRunGroupType;
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
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\SubmitButton;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;


class SequenceController extends AbstractController
{
    public function __construct(
        private MeasurementRepository $measurementRepository,
        private RunRepository $runRepository,
        private MeasurementService $measurementService,
        private RecordsService $recordsService,
        private RecordRepository $recordRepository,
        private EntityManagerInterface $entityManager,
        private ParameterBagInterface $parameterBag,
        private SequenceRepository $sequenceRepository,
        private SequenceService $sequenceService,
        private PaginatorInterface $paginator,
        private RunService $runService,
        private PhenomenonRepository $phenomenonRepository,
        private RunGroupRepository $runGroupRepository,
        private RunGroupService $runGroupService,
        private Security $security,
        private readonly TranslatorInterface $translator,
    ) {}

    #[Route('/{_locale}/chart-data', name: 'chartData')]
    public function getChartData(RecordsService $recordsService, Request $request): JsonResponse
    {
        $data = $request->get('ids');
        if ($data != null) {
            return $this->json($recordsService->getChartData($data));
        } else {
            return $this->json(0);
        }
    }

    #[Route('/{_locale}/add-run-measurement', name: 'addRunMeasurement')]
    public function addRunMeasurement(Request $request): JsonResponse
    {
        $measurement = $this->measurementRepository->find($request->get('measurement_id'));
        $run = $this->runRepository->find($request->get('run_id'));

        if ($run === null) {
            throw new \Exception("Run doesn't exist");
        }
        if ($measurement === null) {
            throw new \Exception("Measurement doesn't exist");
        }

        $res = $this->measurementService->switchBelongsToRun($measurement, $run);

        return $this->json($res);
    }

    #[Route('/{_locale}/validate-file', name: 'validateFile')]
    public function validateFile(Request $request): ?JsonResponse
    {
        $file = $request->files;
        if ($file->get('datafile') !== null) {
            return $this->json(
                $this->recordsService->validateDataFile(
                    $file->get('datafile'),
                    $request->get('skip_first_row', false) === "1",
                    $request->get('first_column_time', false) === "1"
                )
            );
        }

        return null;
    }

    #[Route('/{_locale}/israinintensityr', name: 'israinintensityr')]
    public function israinintensityr(Request $request): ?RedirectResponse
    {
        if ($request->get('recordId') !== null) {
            $record = $this->recordRepository->find($request->get('recordId'));
            if ($record === null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement() !== null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setRainIntensity($record);
                    $this->entityManager->persist($run);
                    $this->entityManager->flush();
                }
            }
        } elseif ($request->get('removeRecordId') !== null) {
            $record = $this->recordRepository->find($request->get('removeRecordId'));
            if ($record === null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement() !== null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setRainIntensity(null);
                    $this->entityManager->persist($run);
                    $this->entityManager->flush();
                }
            }
        }

        if (isset($sequence)) {
            return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
        }

        return null;
    }


    #[Route('/{_locale}/isinitmoisturer', name: 'isinitmoisturer')]
    public function isinitmoisturer(Request $request): RedirectResponse
    {
        $sequence = null;

        if ($request->get('recordId') !== null) {
            $record = $this->recordRepository->find($request->get('recordId'));
            if ($record === null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement() !== null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setInitMoisture($record);
                    $this->entityManager->persist($run);
                    $this->entityManager->flush();
                }
            }
        } elseif ($request->get('removeRecordId') !== null) {
            $record = $this->recordRepository->find($request->get('removeRecordId'));
            if ($record === null) {
                throw new \Exception("Record doesn't exist");
            }
            if ($record->getMeasurement() !== null) {
                foreach ($record->getMeasurement()->getRuns() as $run) {
                    $sequence = $run->getSequence();
                    $run->setInitMoisture(null);
                    $this->entityManager->persist($run);
                    $this->entityManager->flush();
                }
            }
        }

        return $this->redirectToRoute('sequence', ['id' => $sequence?->getId()]);
    }

    #[Route('/{_locale}/sequence/{id}/download-file', name: 'downloadSequenceFile')]
    public function downloadFile(Request $request, int $id): BinaryFileResponse
    {
        if ($request->get('runId') !== null) {
            $entity = $this->runRepository->find($request->get('runId'));
        } elseif ($request->get('measurementId') !== null) {
            $entity = $this->measurementRepository->find($request->get('measurementId'));
        } elseif($request->get('sequenceId') !== null) {
            $entity = $this->sequenceRepository->find($request->get('sequenceId'));
        } else {
            $entity = null;
        }

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

    #[Route('/{_locale}/sequence/{id}/delete-file', name: 'deleteSequenceFile')]
    public function deleteFile(Request $request, int $id): ?RedirectResponse
    {
        if ($request->get('runId') !== null) {
            $entity = $this->runRepository->find($request->get('runId'));
        } elseif ($request->get('measurementId') !== null) {
            $entity = $this->measurementRepository->find($request->get('measurementId'));
        } elseif($request->get('sequenceId') !== null) {
            $entity = $this->sequenceRepository->find($request->get('sequenceId'));
        } else {
            $entity = null;
        }

        if ($entity === null) {
            throw new \Exception("Parent doesn't exist");
        }

        $filename = $request->get('filename');
        $entity->removeFile($filename);

        return $this->redirectToRoute('sequence', ['id' => $id]);
    }

    #[Route('/{_locale}/sequence/{id}', name: 'sequence')]
    public function edit(Request $request, int $id = null): Response {
        $user = $this->security->getUser();

        if ($id !== null) {
            $sequence = $this->sequenceService->getSequenceById($id);
            $this->denyAccessUnlessGranted(EntityVoter::VIEW, $sequence);

            $sequenceForm = $this->createForm(SequenceType::class, $sequence);
            $appendMesurementForm = $this->createForm(AppendMeasurementType::class);
            $appendRecordForm = $this->createForm(AppendRecordType::class);
            $newRunForm = $this->createForm(RunType::class, new Run());
            $newRunGroupForm = $this->createForm(RunGroupType::class, new RunGroup());
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $newRecordForm = $this->createForm(RecordType::class, new Record());

            $deleteRunGroupForms = [];

            /** @var RunGroup $runGroup */
            foreach ($sequence->getRunGroups() as $runGroup) {
                $deleteRunGroupForm = $this->createForm(
                    DeleteRunGroupType::class,
                    null,
                    ['run_group' => $runGroup]
                );
                $deleteRunGroupForms[$runGroup->getId()] = $deleteRunGroupForm->createView();

                $deleteRunGroupForm->handleRequest($request);
                if ($deleteRunGroupForm->isSubmitted()) {
                    $measurementIds = [];
                    $data = $deleteRunGroupForm->getData();
                    $this->runGroupService->deleteRunGroupFromForm($runGroup, $data);
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

            }


            if ($request->isMethod('POST')) {
                $sequenceForm->handleRequest($request);
                $newRunForm->handleRequest($request);
                $newMesurementForm->handleRequest($request);
                $appendMesurementForm->handleRequest($request);
                $appendRecordForm->handleRequest($request);
                $newRecordForm->handleRequest($request);
                $newRunGroupForm->handleRequest($request);

                if ($newRunGroupForm->isSubmitted()) {
                    $this->runGroupService->addRunGroup($newRunGroupForm, $sequence);
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRunForm->isSubmitted()) {
                    $newRunFormData = $newRunForm->getData();
                    $runGroup = $this->runGroupRepository->find($newRunForm->get('parent_id')->getData());
                    if ($runGroup === null) {
                        throw new \Exception("runGroup doesn't exist");
                    }
                    $newRunFormData->setRunGroup($runGroup);
                    $this->entityManager->persist($newRunFormData);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newMesurementForm->isSubmitted()) {
                    $formMeasurementData = $newMesurementForm->getData();
                    $run = $this->runRepository->find($newMesurementForm->get('parent_id')->getData());
                    if ($run === null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $formMeasurementData->addRun($run);
                    $formMeasurementData->setUser($user);
                    $this->entityManager->persist($formMeasurementData);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($appendMesurementForm->isSubmitted()) {
                    $measurementId = $appendMesurementForm->get('measurementId')->getData();
                    $measurement = $this->measurementRepository->find($measurementId);
                    $run = $this->runRepository->find($appendMesurementForm->get('parent_id')->getData());
                    if ($run === null) {
                        throw new \Exception("run doesn't exist");
                    }
                    if ($measurement === null) {
                        throw new \Exception("measurement doesn't exist");
                    }
                    $run->addMeasurement($measurement);
                    $this->entityManager->persist($run);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($appendRecordForm->isSubmitted()) {
                    $recordId = $appendRecordForm->get('recordId')->getData();
                    $record = $this->recordRepository->find($recordId);
                    if($record === null) {
                        $this->addFlash('error', 'Record not found');
                        return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                    }

                    $measurement = $this->measurementRepository->find($appendRecordForm->get('parent_id')->getData());
                    if ($measurement === null) {
                        throw new \Exception("measurement doesn't exist");
                    }

                    $record->setMeasurement($measurement);
                    $this->entityManager->persist($record);
                    $this->entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {

                    /**
                     * @var Record
                     */
                    $record = $newRecordForm->getData();
                    $measurement = $this->measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    if ($measurement === null) {
                        throw new \Exception("Measurement doesn't exist");
                    }
                    $record->setMeasurement($measurement);
                    $this->entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
//                    if ($file !== null) {
//                        $runService->uploadFile($file, $measurement->getRuns()->get(0));
//                    }
                    $this->entityManager->flush();

                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($sequenceForm->isSubmitted()) {
                    /** @var FormInterface $partialForm */
                    $partialForm = $sequenceForm->getClickedButton()->getParent();
                    $partialData = $partialForm->getData();
                    if ($partialForm->has('rawData') && $partialForm->get('rawData') !== null) {
                        foreach ($partialForm->get('rawData')->getData() as $file) {
                            if ($partialData instanceof Run) {
                                $this->runService->uploadFile($file, $partialData);
                            }
                            if ($partialData instanceof Measurement) {
                                $this->measurementService->uploadFile($file, $partialData);
                            }
                            if ($partialData instanceof Sequence) {
                                $this->sequenceService->uploadFile($file, $partialData);
                            }
                        }
                    }

                    $this->entityManager->persist($partialData);
                    $this->entityManager->flush();
                }

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_run') !== null) {
                $run = $this->entityManager->find(Run::class, $request->get('delete_run'));
                if ($run === null) {
                    throw new \Exception("run doesn't exist");
                }
                foreach ($run->getMeasurements() as $measurement) {
                    foreach ($measurement->getRecords() as $record) {
                        foreach ($record->getData() as $data) {
                            $this->entityManager->remove($data);
                        }
                        $this->entityManager->flush();
                        $this->entityManager->remove($record);
                    }
                    $this->entityManager->flush();
                    $this->entityManager->remove($measurement);
                }
                $this->entityManager->flush();
                $this->entityManager->remove($run);
                $this->entityManager->flush();

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_measurement') !== null) {
                $this->measurementService->deleteMeasurement($request->get('delete_measurement'));
                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('unlink_measurement') !== null) {
                $measurement = $this->measurementRepository->find($request->get('unlink_measurement'));
                $run = $this->runRepository->find($request->get('runId'));
                if ($run === null) {
                    throw new \Exception("run doesn't exist");
                }
                if ($measurement === null) {
                    throw new \Exception("measurement doesn't exist");
                }
                $run->removeMeasurement($measurement);
                $this->entityManager->persist($run);
                $this->entityManager->flush();
                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
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

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if($user === null) {
                $this->addFlash('warning', $this->translator->trans('not logged info'));
            }

            return $this->render(
                'sequence/edit.html.twig',
                [
                    'header' => $this->sequenceService->getSequenceHeader($sequence),
                    'runs' => $this->sequenceService->getRunsArray($sequence),
                    'form' => $sequenceForm->createView(),
                    'sequence' => $sequence,
                    'measurementForm' => $newMesurementForm->createView(),
                    'appendMeasurementForm' => $appendMesurementForm->createView(),
                    'appendRecordForm' => $appendRecordForm->createView(),
                    'runForm' => $newRunForm->createView(),
                    'runGroupForm' => $newRunGroupForm->createView(),
                    'runSevice' => $this->runService,
                    'recordsService' => $this->recordsService,
                    'recordForm' => $newRecordForm->createView(),
                    'deleteRunGroupForms' => $deleteRunGroupForms,
                ]
            );

        } else {
            $form = $this->createForm(SequenceBasicType::class, new Sequence());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $sequence = $form->getData();
                    $sequence->setUser($user);
                    $this->entityManager->persist($sequence);
                    $this->entityManager->flush();
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

    #[Route('/{_locale}/remove-sequence', name: 'remove_sequence')]
    public function removeSequence(Request $request): RedirectResponse
    {
        $this->sequenceRepository->setDeleted($request->get('id'));
        return $this->redirectToRoute('sequences');
    }

    #[Route('/{_locale}/export-sequence', name: 'export_sequence')]
    public function exportSequence(Request $request): Response
    {
        if ($request->get('id') === null) {
            throw new \Exception("Invalid parameter id");
        }

        $id = $request->get('id');
        $xml = $this->sequenceService->exportSequence($id);

        $response = new Response();
        $filename = 'sequence-' . $id . '.xml';

        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-Type', 'application/xhtml+xml');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '";');
        $response->headers->set('Content-Length', (string) strlen($xml));
        $response->sendHeaders();
        $response->setContent($xml);

        return $response;
    }


    #[Route('/{_locale}/sequences', name: 'sequences')]
    public function list(Request $request): Response
    {
        $filter = $this->createForm(SequenceFilterType::class);
        $filter->handleRequest($request);

        $paginatorQuery = $this->sequenceRepository->getPaginatorQuery(
            $filter->getData(),
            $request->get('order', 'date'),
            $request->get('direction', 'DESC')
        );

        if ($filter->isSubmitted() && $filter->get('export')->isClicked()) {
            $xml = $this->sequenceService->exportSequences($paginatorQuery->getQuery()->getResult());
            $response = new Response();
            $filename = 'sequences.xml';

            $response->headers->set('Cache-Control', 'private');
            $response->headers->set('Content-Type', 'application/xhtml+xml');
            $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '";');
            $response->headers->set('Content-Length', (string) strlen($xml));
            $response->sendHeaders();
            $response->setContent($xml);

            return $response;
        }

        $pagination = $this->paginator->paginate(
            $paginatorQuery,
            $request->query->getInt('page', 1),
            20,
            [
                PaginatorInterface::DEFAULT_SORT_FIELD_NAME => 'sequence.date',
                PaginatorInterface::DEFAULT_SORT_DIRECTION => 'DESC',
            ]
        );

        return $this->render(
            'sequence/list.html.twig',
            [
                'pagination' => $pagination,
                'filter' => $filter->createView(),
            ]
        );
    }

    #[Route('/{_locale}/sequences-overview', name: 'sequencesOverview')]
    public function overview(Request $request): Response
    {
        $pagination = $this->paginator->paginate(
            $this->sequenceRepository->getPaginatorQuery(
                [],
                $request->get('order', 'date'),
                $request->get('direction', 'DESC')
            ),
            $request->query->getInt('page', 1),
            1000,
            [
                PaginatorInterface::DEFAULT_SORT_FIELD_NAME => 'sequence.date',
                PaginatorInterface::DEFAULT_SORT_DIRECTION => 'DESC',
            ]
        );

        return $this->render(
            'sequence/overview.html.twig',
            [
                'pagination' => $pagination,
                'runSevice' => $this->runService,
                'phenomenonRepository' => $this->phenomenonRepository,
            ]
        );
    }


}
