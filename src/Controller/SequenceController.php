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
use App\Services\MeasurementService;
use App\Services\RecordsService;
use App\Services\RunGroupService;
use App\Services\RunService;
use App\Services\SequenceService;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class SequenceController extends AbstractController {

    /**
     * @Route("/{_locale}/chart-data", name="chartData")
     */
    public function getChartData(RecordsService $recordsService, Request $request) {
        $data = $request->get('ids');
        if ($data) {
            return $this->json($recordsService->getChartData($data));
        } else {
            return $this->json(0);
        }
    }

    /**
     * @Route("/{_locale}/add-run-measurement", name="addRunMeasurement")
     */
    public function addRunMeasurement(MeasurementRepository $measurementRepository, RunRepository $runRepository, MeasurementService $measurementService, Request $request) {
        $measurement = $measurementRepository->find($request->get('measurement_id'));
        $run = $runRepository->find($request->get('run_id'));
        $res = $measurementService->switchBelongsToRun($measurement, $run);
        return $this->json($res);
    }

    /**
     * @Route("/{_locale}/validate-file", name="validateFile")
     */
    public function validateFile(RecordsService $recordsService, Request $request) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        $file = $request->files;
        if ($file->get('file')) {
            return $this->json($recordsService->validateDataFile($file->get('file')));
        }
    }

    /**
     * @Route("/{_locale}/israinintensityr", name="israinintensityr")
     */
    public function israinintensityr(RecordRepository $recordRepository, EntityManagerInterface $entityManager, Request $request) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('recordId')) {
            $record = $recordRepository->find($request->get('recordId'));
            foreach ($record->getMeasurement()->getRuns() as $run) {
                $sequence = $run->getSequence();
                $run->setRainIntensity($record);
                $entityManager->persist($run);
                $entityManager->flush();
            }
        }
        return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
    }

    /**
     * @Route("/{_locale}/isinitmoisturer", name="isinitmoisturer")
     */
    public function isinitmoisturer(RecordRepository $recordRepository, EntityManagerInterface $entityManager, Request $request) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('recordId')) {
            $record = $recordRepository->find($request->get('recordId'));
            foreach ($record->getMeasurement()->getRuns() as $run) {
                $sequence = $run->getSequence();
                $run->setInitMoisture($record);
                $entityManager->persist($run);
                $entityManager->flush();
            }
        }
        return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
    }

    /**
     * @Route("/{_locale}/download-file", name="downloadFile")
     */
    public function downloadFile(RunRepository $runRepository, Request $request) {
        $run = $runRepository->find($request->get('runId'));
        $filename = $request->get('filename');
        return $this->file('data/'.$run->getSequence()->getId().'/'.$run->getId().'/'.$filename);
    }

    /**
     * @Route("/{_locale}/delete-file", name="deleteFile")
     */
    public function deleteFile(RunRepository $runRepository, Request $request) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        $run = $runRepository->find($request->get('runId'));
        $filename = $request->get('filename');
        $run->removeFile($filename);
        return $this->redirectToRoute('sequence', ['id' => $run->getSequence()->getId()]);
    }

    /**
     * @Route("/{_locale}/sequence/{id}", name="sequence")
     */
    public function edit(EntityManagerInterface $entityManager,
                         Request $request,
                         SequenceService $sequenceService,
                         RunService $runService,
                         RunRepository $runRepository,
                         RunGroupRepository $runGroupRepository,
                         MeasurementRepository $measurementRepository,
                         ParameterBagInterface $parameterBag,
                         RecordTypeRepository $recordTypeRepository,
                         UnitRepository $unitRepository,
                         RunGroupService $runGroupService,
                         int $id = null) {
        if ($id) {
            $sequence = $sequenceService->getSequenceById($id);
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
                    $newRunFormData->setRunGroup($runGroupRepository->find($newRunForm->get('parent_id')->getData()));
                    $entityManager->persist($newRunFormData);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newMesurementForm->isSubmitted()) {
                    $formMeasurementData = $newMesurementForm->getData();
                    $formMeasurementData->addRun($runRepository->find($newMesurementForm->get('parent_id')->getData()));
                    $entityManager->persist($newMesurementForm->getData());
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {
                    $record = $newRecordForm->getData();
                    $measurement = $measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    $record->setMeasurement($measurement);

                    $entityManager->persist($record);
                    foreach ($record->getData() as $data) {
                        $data->setRecord($record);
                    }

                    $file = $newRecordForm->get('datafile')->getData();
                    if ($file) {
                       $runService->uploadFile($file, $measurement->getRun());
                    }
                    $entityManager->flush();

                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($sequenceForm->isSubmitted()) {
                    $partialForm = $sequenceForm->getClickedButton()->getParent();
                    $partialData = $partialForm->getData();

                    if ($partialForm->has('rawData') && $partialForm->get('rawData')) {
                        foreach ($partialForm->get('rawData')->getData() as $file) {
                            $runService->uploadFile($file, $partialData);
                        }
                    }

                    $entityManager->persist($partialData);
                    $entityManager->flush();
                }

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_run')) {
                $run = $entityManager->find(Run::class, $request->get('delete_run'));
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



            if ($request->get('delete_measurement')) {
                $measurement = $entityManager->find(Measurement::class, $request->get('delete_measurement'));

                foreach ($measurement->getRecords() as $record) {
                    foreach ($record->getData() as $data) {
                        $entityManager->remove($data);
                    }
                    $entityManager->flush();
                    $entityManager->remove($record);
                }
                $entityManager->remove($measurement);
                $entityManager->flush();

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }

            if ($request->get('delete_record')) {
                $record = $entityManager->find(Record::class, $request->get('delete_record'));

                foreach ($record->getData() as $data) {
                    $entityManager->remove($data);
                }
                $entityManager->flush();
                $entityManager->remove($record);
                $entityManager->flush();

                return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
            }


            return $this->render('sequence/edit.html.twig', [
                'header' => $sequenceService->getSequenceHeader($sequence),
                'runs' => $sequenceService->getRunsArray($sequence),
                'form' => $sequenceForm->createView(),
                'measurementForm' => $newMesurementForm->createView(),
                'runForm' => $newRunForm->createView(),
                'runGroupForm' => $newRunGroupForm->createView(),
                'runSevice'=>$runService,
                'recordForm' => $newRecordForm->createView(),
            ]);

        } else {
            $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
            $form = $this->createForm(SequenceBasicType::class, new Sequence());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $sequence = $form->getData();
                    $entityManager->persist($sequence);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }
            }
            return $this->render('sequence/add.html.twig', [
                'form' => $form->createView()
            ]);
        }
    }

    /**
     * @Route("/{_locale}/sequences", name="sequences")
     */
    public function list(EntityManagerInterface $em, PaginatorInterface $paginator, Request $request, SequenceRepository $sequenceRepository) {
        $filter = $this->createForm(SequenceFilterType::class);
        $filter->handleRequest($request);

        $pagination = $paginator->paginate(
            $sequenceRepository->getPaginatorQuery($filter->getData(), $request->get('order','date'), $request->get('direction','DESC')),
            $request->query->getInt('page', 1),
            20,
            [PaginatorInterface::DEFAULT_SORT_FIELD_NAME=>'sequence.date',
                PaginatorInterface::DEFAULT_SORT_DIRECTION=>'DESC']
        );
        return $this->render('sequence/list.html.twig', ['pagination' => $pagination, 'filter' => $filter->createView()]);
    }

    /**
     * @Route("/{_locale}/sequences-overview", name="sequencesOverview")
     */
    public function overview(EntityManagerInterface $em, Request $request, SequenceRepository $sequenceRepository, RunService $runService, PhenomenonRepository $phenomenonRepository) {
        $sequences = $sequenceRepository->findBy([],['date'=>'ASC']);
        return $this->render('sequence/overview.html.twig',[
            'sequences'=>$sequences,
            'runSevice'=>$runService,
            'phenomenonRepository'=>$phenomenonRepository,
        ]);
    }

}
