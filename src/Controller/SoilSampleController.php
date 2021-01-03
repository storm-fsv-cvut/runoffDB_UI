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
use App\Entity\SoilSample;
use App\Form\MeasurementType;
use App\Form\RecordType;
use App\Form\SequenceBasicType;
use App\Form\SoilSampleBasicType;
use App\Form\SoilSampleType;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\RunRepository;
use App\Repository\SoilSampleRepository;
use App\Services\MeasurementService;
use App\Services\RecordsService;
use App\Services\SoilSampleService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SoilSampleController extends AbstractController {

    /**
     * @Route("/{_locale}/sample-chart-data", name="chartDataSoilSample")
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
     * @Route("/{_locale}/soil-sample/{id}", name="soilSample")
     */
    public function edit(SoilSampleService $soilSampleService,
                         Request $request,
                         EntityManagerInterface $entityManager,
                         MeasurementRepository $measurementRepository,
                         MeasurementService $measurementService,
                         int $id = null):Response {
        if ($id) {
            $newMesurementForm = $this->createForm(MeasurementType::class, new Measurement());
            $newRecordForm = $this->createForm(RecordType::class, new Record());
            $soilSample = $soilSampleService->getSoilSampleById($id);
            $soilSampleForm = $this->createForm(SoilSampleType::class, $soilSample);

            if ($request->isMethod('POST')) {
                $soilSampleForm->handleRequest($request);
                $newMesurementForm->handleRequest($request);
                $newRecordForm->handleRequest($request);

                if ($soilSampleForm->isSubmitted()) {
                    $soilSample = $soilSampleForm->getData();
                    if ($soilSample->getPlot()) {
                        $soilSample->setLocality($soilSample->getPlot()->getLocality());
                    }
                    $entityManager->persist($soilSample);
                    $entityManager->flush();
                }

                if ($newMesurementForm->isSubmitted()) {
                    $measurement = $newMesurementForm->getData();
                    $measurement->addSoilSample($soilSample);
                    $entityManager->persist($measurement);
                    $entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
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
                        $soilSampleService->uploadFile($file, $soilSample);
                    }
                    $entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            if ($request->get('delete_measurement')) {
                if ($request->get('delete_measurement')) {
                    $measurementService->deleteMeasurement($request->get('delete_measurement'));
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            if ($request->get('delete_record')) {
                $record = $entityManager->find(Record::class, $request->get('delete_record'));

                foreach ($record->getData() as $data) {
                    $entityManager->remove($data);
                }
                $entityManager->flush();
                $entityManager->remove($record);
                $entityManager->flush();

                return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
            }

            return $this->render('soilSample/edit.html.twig',[
                'measurementForm' => $newMesurementForm->createView(),
                'recordForm' => $newRecordForm->createView(),
                'measurements'=>$soilSampleService->getMeasurementsArray($soilSample),
                'soilSample'=>$soilSample,
                'form' => $soilSampleForm->createView(),
            ]);
        } else {
            $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
            $form = $this->createForm(SoilSampleBasicType::class, new SoilSample());

            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    $soilSample = $form->getData();
                    if ($soilSample->getPlot()) {
                        $soilSample->setLocality($soilSample->getPlot()->getLocality());
                    }
                    $entityManager->persist($soilSample);
                    $entityManager->flush();
                    return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
                }
            }

            return $this->render('soilSample/add.html.twig', [
                'form' => $form->createView()
            ]);
        }
    }

    /**
     * @Route("/{_locale}/soil-samples", name="soilSamples")
     */
    public function list(PaginatorInterface $paginator, SoilSampleRepository $soilSampleRepository, Request $request, SoilSampleService $soilSampleService):Response {

        $pagination = $paginator->paginate(
            $soilSampleRepository->getPaginatorQuery(),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('soilSample/list.html.twig', ['pagination' => $pagination]);
    }

    /**
     * @Route("/{_locale}/remove-soil-sample", name="remove_soilsample")
     */
    public function removeSoilSample(Request $request,SoilSampleRepository $soilSampleRepository) {
        $soilSampleRepository->setDeleted($request->get('id'));
        return $this->redirectToRoute('soilSamples');
    }

    /**
     * @Route("/{_locale}/is-moisture", name="ismoisture")
     */
    public function istmoisture(RecordRepository $recordRepository, SoilSampleRepository $soilSampleRepository, SoilSampleService $soilSampleService, EntityManagerInterface $entityManager, Request $request):Response {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('soilSampleId') && $request->get('recordId')) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId') );
            $record = $recordRepository->find($request->get('recordId'));
            $soilSample->setMoisture($record);
            $entityManager->persist($soilSample);
            $entityManager->flush();
        }
        return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
    }


    /**
     * @Route("/{_locale}/is-texture", name="istexture")
     */
    public function istexture(RecordRepository $recordRepository, SoilSampleRepository $soilSampleRepository, SoilSampleService $soilSampleService, EntityManagerInterface $entityManager, Request $request):Response {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('soilSampleId') && $request->get('recordId')) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId') );
            $record = $recordRepository->find($request->get('recordId'));
            $soilSample->setTextureRecord($record);
            $entityManager->persist($soilSample);
            $entityManager->flush();
        }
        return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
    }

    /**
     * @Route("/{_locale}/is-corg", name="iscorg")
     */
    public function iscorg(RecordRepository $recordRepository, SoilSampleRepository $soilSampleRepository, SoilSampleService $soilSampleService, EntityManagerInterface $entityManager, Request $request):Response {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('soilSampleId') && $request->get('recordId')) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId') );
            $record = $recordRepository->find($request->get('recordId'));
            $soilSample->setCorg($record);
            $entityManager->persist($soilSample);
            $entityManager->flush();
        }
        return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
    }

    /**
     * @Route("/{_locale}/is-bulkDensity", name="isbulkDensity")
     */
    public function isbulkDensity(RecordRepository $recordRepository, SoilSampleRepository $soilSampleRepository, SoilSampleService $soilSampleService, EntityManagerInterface $entityManager, Request $request):Response {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        if ($request->get('soilSampleId') && $request->get('recordId')) {
            $soilSample = $soilSampleService->getSoilSampleById($request->get('soilSampleId') );
            $record = $recordRepository->find($request->get('recordId'));
            $soilSample->setBulkDensity($record);
            $entityManager->persist($soilSample);
            $entityManager->flush();
        }
        return $this->redirectToRoute('soilSample', ['id' => $soilSample->getId()]);
    }

    /**
     * @Route("/{_locale}/soil-samples-overview", name="soilSamplesOverview")
     */
    public function overview(EntityManagerInterface $em, Request $request, SoilSampleService $soilSampleService, SoilSampleRepository $soilSampleRepository, PhenomenonRepository $phenomenonRepository):Response {
        $soilSamples = $soilSampleRepository->findBy(["deleted"=>null],['dateSampled'=>'ASC']);
        return $this->render('soilSample/overview.html.twig',[
            'soilSamples'=>$soilSamples,
            'phenomenonRepository'=>$phenomenonRepository,
            'soilSampleService' => $soilSampleService
        ]);
    }

}
