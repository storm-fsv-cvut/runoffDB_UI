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
use App\Entity\Sequence;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\RunType;
use App\Form\SequenceType;
use App\Repository\MeasurementRepository;
use App\Repository\RunRepository;
use App\Services\RecordsService;
use App\Services\RunService;
use App\Services\SequenceService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SequenceController extends AbstractController {

    /**
     * @Route("/chart-data", name="chartData")
     */
    public function getChartData(RecordsService $recordsService, Request $request) {
        return $this->json($recordsService->getChartData([5, 210, 330]));
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
     * @Route("/sequence/{id}", name="sequence")
     */
    public function edit(EntityManagerInterface $entityManager, Request $request, SequenceService $sequenceService, RunService $runService, RunRepository $runRepository, MeasurementRepository $measurementRepository, int $id = null) {
        if ($id) {
            $sequence = $sequenceService->getSequenceById($id);

            $formRun[0] = $this->createForm(RunType::class, new Run());
            foreach ($sequence->getRuns() as $run) {
                $formRun[$run->getId()] = $this->createForm(RunType::class, $run);
            }

            $formMeasurementNew = $this->createForm(MeasurementType::class, new Measurement());
            $formRecordNew = $this->createForm(RecordType::class, new Record());

            if ($request->isMethod('POST')) {
                foreach ($formRun as $fr) {
                    $fr->handleRequest($request);
                    if ($fr->isSubmitted()) {
                        $runService->addRun($fr, $sequence);
                        return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                    }
                }

                $formMeasurementNew->handleRequest($request);
                $formRecordNew->handleRequest($request);


                if ($formRecordNew->isSubmitted()) {
                    $record = $formRecordNew->getData();
                    $record->setMeasurement($measurementRepository->find($formRecordNew->get('measurement_id')->getData()));
                    foreach ($formRecordNew->get('data')->getData() as $data) {
                        $record->addData($data);
                    }
                    if ($record->getRelatedValueUnit() === null) {
                        $record->setIsTimeline(true);
                    } else {
                        $record->setIsTimeline(false);
                    }
                    $entityManager->persist($record);
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

                if ($formMeasurementNew->isSubmitted()) {
                    $formMeasurementData = $formMeasurementNew->getData();
                    $formMeasurementData->setRun($runRepository->find($formMeasurementNew->get('run_id')->getData()));
                    $entityManager->persist($formMeasurementNew->getData());
                    $entityManager->flush();
                    return $this->redirectToRoute('sequence', ['id' => $sequence->getId()]);
                }

            }

            return $this->render('sequence/edit.html.twig', [
                'header' => $sequenceService->getSequenceHeader($sequence),
                'runs' => $sequenceService->getRunsArray($sequence),
                'formsRun' => $formRun,
                'formMeasurement' => $formMeasurementNew->createView(),
                'formRecord' => $formRecordNew->createView(),
            ]);

        } else {
            $form = $this->createForm(SequenceType::class, new Sequence());
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
     * @Route("/sequences", name="sequences")
     */
    public function list(ContainerInterface $container, EntityManagerInterface $entityManager) {
        $renderer = $container->get('dtc_grid.renderer.factory')->create('datatables');
        $gridSource = $container->get('dtc_grid.manager.source')->get("App\Entity\Sequence");
        $renderer->bind($gridSource);
        $params = $renderer->getParams();
        return $this->render('sequence/list.html.twig', $params);
    }
}
