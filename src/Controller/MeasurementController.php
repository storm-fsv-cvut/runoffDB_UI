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
use App\Entity\Sequence;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\SequenceBasicType;
use App\Form\MeasurementBasicType;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\RunRepository;
use App\Repository\SequenceRepository;
use App\Services\RecordsService;
use App\Services\MeasurementService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MeasurementController extends AbstractController {

    /**
     * @Route("/{_locale}/measurement/generate-details", name="measurementaGenerateDetails")
     */
    public function fillDetails(MeasurementService $measurementService) {
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
        if ($id) {
            $newRecordForm = $this->createForm(RecordType::class, new Record());
            $measurement = $measurementService->getMeasurementById($id);
            $measurementForm = $this->createForm(MeasurementType::class, $measurement);

            if ($request->isMethod('POST')) {
                $measurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($measurementForm->isSubmitted()) {
                    $measurement = $measurementForm->getData();
                    $entityManager->persist($measurement);
                    $entityManager->flush();
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
                        $measurementService->uploadFile($file, $measurement);
                    }
                    $entityManager->flush();
                    return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
                }
            }
            if ($request->get('delete_record')) {
                $recordsService->deleteRecord($request->get('delete_record'));
                return $this->redirectToRoute('measurement', ['id' => $measurement->getId()]);
            }

            return $this->render('measurement/edit.html.twig',[
                'recordForm' => $newRecordForm->createView(),
                'measurement'=>$measurement,
                'formMeasurement' => $measurementForm->createView(),
            ]);
        } else {
            $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
            $form = $this->createForm(MeasurementType::class, new Measurement());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $measurement = $form->getData();
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
    public function removeMeasurement(Request $request,MeasurementService $measurementService) {
        $measurementService->deleteMeasurement($request->get('id'));
        return $this->redirectToRoute('measurements');
    }

    /**
     * @Route("/{_locale}/measurements", name="measurements")
     */
    public function list(PaginatorInterface $paginator, MeasurementRepository $measurementRepository, Request $request, MeasurementService $measurementService):Response {

        $pagination = $paginator->paginate(
            $measurementRepository->getPaginatorQuery(),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('measurement/list.html.twig', ['pagination' => $pagination]);
    }
}
