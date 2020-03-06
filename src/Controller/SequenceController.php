<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Entity\Measurement;
use App\Entity\Plot;
use App\Entity\Record;
use App\Entity\Run;
use App\Entity\Sequence;
use App\Form\DefinitionEntityType;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\RunType;
use App\Form\SequenceBasicType;
use App\Form\SequenceFilterType;
use App\Form\SequenceType;
use App\Repository\MeasurementRepository;
use App\Repository\RecordTypeRepository;
use App\Repository\RunRepository;
use App\Repository\SequenceRepository;
use App\Repository\UnitRepository;
use App\Services\RecordsService;
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
     * @Route("/chart-data", name="chartData")
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
     * @Route("/validate-file", name="validateFile")
     */
    public function validateFile(RecordsService $recordsService, Request $request) {
        $files = $request->files;
        foreach ($files as $file) {
            if (isset($file['datafile'])) {
                return $this->json($recordsService->validateDataFile($file['datafile']));
            }
        }
        exit;
    }

    /**
     * @Route("/download-file", name="downloadFile")
     */
    public function downloadFile(RunRepository $runRepository, Request $request) {
        $run = $runRepository->find($request->get('runId'));
        $filename = $request->get('filename');
        return $this->file('data/'.$run->getSequence()->getId().'/'.$run->getId().'/'.$filename);
    }

    /**
     * @Route("/delete-file", name="deleteFile")
     */
    public function deleteFile(RunRepository $runRepository, Request $request) {
        $run = $runRepository->find($request->get('runId'));
        $filename = $request->get('filename');
        $run->removeFile($filename);
        return $this->redirectToRoute('sequence', ['id' => $run->getSequence()->getId()]);
    }

    /**
     * @Route("/sequence/{id}", name="sequence")
     */
    public function edit(EntityManagerInterface $entityManager,
                         Request $request,
                         SequenceService $sequenceService,
                         RunService $runService,
                         RunRepository $runRepository,
                         MeasurementRepository $measurementRepository,
                         ParameterBagInterface $parameterBag,
                         RecordTypeRepository $recordTypeRepository,
                         UnitRepository $unitRepository,
                         int $id = null) {
        if ($id) {
            $sequence = $sequenceService->getSequenceById($id);
            $sequenceForm = $this->createForm(SequenceType::class, $sequence);
            $newRunForm = $this->createForm(RunType::class, new Run());
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $newRecordForm = $this->createForm(RecordType::class, new Record());


            if ($request->isMethod('POST')) {
                $sequenceForm->handleRequest($request);
                $newRunForm->handleRequest($request);
                $newMesurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($newRunForm->isSubmitted()) {
                    $runService->addRun($newRunForm, $sequence);
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newMesurementForm->isSubmitted()) {
                    $formMeasurementData = $newMesurementForm->getData();
                    $formMeasurementData->setRun($runRepository->find($newMesurementForm->get('parent_id')->getData()));
                    $entityManager->persist($newMesurementForm->getData());
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($newRecordForm->isSubmitted()) {
                    $record = $newRecordForm->getData();
                    $measurement = $measurementRepository->find($newRecordForm->get('parent_id')->getData());
                    $record->setMeasurement($measurement);
                    if ($record->getRelatedValueUnit() === null) {
                        $record->setIsTimeline(true);
                    } else {
                        $record->setIsTimeline(false);
                    }
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

                    if ($partialForm->has('rainIntensityData')) {
                        $rainIntensityData = $partialForm->get('rainIntensityData')->getData();
                        if ($partialData->getRainIntensityMeasurement()==null) {
                            $rainIntensityMeasurement = new Measurement();
                            $rainIntensityMeasurement->setRun($partialData);
                            $rainIntensityMeasurement->setDescriptionCZ('intenzita srážky');
                            $rainIntensityMeasurement->setDescriptionEN('rain intensity');
                            $rainIntensityMeasurement_record = new Record();
                            $rainIntensityMeasurement_record->setRecordType($recordTypeRepository->find(5));
                            $rainIntensityMeasurement_record->setUnit($unitRepository->find(6));
                        }
                        foreach ($rainIntensityData as $data) {
                            $rainIntensityMeasurement_record->addData($data);
                        }
                        $rainIntensityMeasurement->addRecord($rainIntensityMeasurement_record);
                        $partialData->setRainIntensityMeasurement($rainIntensityMeasurement);
                        $partialData->addMeasurement($rainIntensityMeasurement);
                    }

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


            return $this->render('sequence/editSequence.html.twig', [
                'header' => $sequenceService->getSequenceHeader($sequence),
                'runs' => $sequenceService->getRunsArray($sequence),
                'form' => $sequenceForm->createView(),
                'measurementForm' => $newMesurementForm->createView(),
                'runForm' => $newRunForm->createView(),
                'recordForm' => $newRecordForm->createView(),
            ]);

        } else {
            $formPlot = $this->createForm(DefinitionEntityType::class, new Plot(), ['data_class' => Plot::class]);
            $form = $this->createForm(SequenceBasicType::class, new Sequence());


            if ($request->isMethod('POST')) {
                $formPlot->handleRequest($request);
                if ($formPlot->isSubmitted() && $formPlot->isValid()) {
                    $plot = $formPlot->getData();
                    $entityManager = $this->getDoctrine()->getManager();
                    $entityManager->persist($plot);
                    $entityManager->flush();
                    if ($request->isXmlHttpRequest()) {
                        return $this->json(['id'=>$plot->getId(),'label'=>$plot.""]);
                    }
                }

                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $sequence = $form->getData();
                    $entityManager->persist($sequence);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }
            }
            return $this->render('sequence/add.html.twig', [
                'form' => $form->createView(),
                'formPlot' => $formPlot->createView(),
            ]);
        }
    }


    /**
     * @Route("/sequences", name="sequences")
     */
    public function list(EntityManagerInterface $em, PaginatorInterface $paginator, Request $request, SequenceRepository $sequenceRepository) {
        $filter = $this->createForm(SequenceFilterType::class);

        $pagination = $paginator->paginate(
            $sequenceRepository->createQueryBuilder('sequence'),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('sequence/list.html.twig', ['pagination' => $pagination, 'filter' => $filter->createView()]);
    }
}
