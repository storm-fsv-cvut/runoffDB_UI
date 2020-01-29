<?php


namespace App\Services;
use App\Entity\Measurement;
use App\Entity\Record;
use App\Entity\RecordType;
use App\Entity\Sequence;
use App\Repository\RecordTypeRepository;
use App\Repository\RunRepository;
use App\Repository\UnitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormInterface;

class RunService {
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var RecordTypeRepository
     */
    private $recordTypeRepository;
    /**
     * @var UnitRepository
     */
    private $unitRepository;
    /**
     * @var RunRepository
     */
    private $runRepository;

    public function __construct(EntityManagerInterface $entityManager, RecordTypeRepository $recordTypeRepository, UnitRepository $unitRepository, RunRepository $runRepository) {
        $this->entityManager = $entityManager;
        $this->recordTypeRepository = $recordTypeRepository;
        $this->unitRepository = $unitRepository;
        $this->runRepository = $runRepository;
    }

    public function addRun(FormInterface $formRun, Sequence $sequence) {
        $run = $formRun->getData();
        $run->setSequence($sequence);
        $this->entityManager->persist($run);

        $initMoistureMeasurement = new Measurement();
        $initMoistureMeasurement->setRun($run);
        $initMoistureMeasurement->setDescriptionCZ('vlhkost');
        $initMoistureMeasurement->setDescriptionEN('moisture');
        $initMoistureMeasurement_record = new Record();
        $initMoistureMeasurement_record->setRecordType($this->recordTypeRepository->find(5));
        $initMoistureMeasurement_record->setUnit($this->unitRepository->find(6));
        $initMoistureData = $formRun->get('initMoistureData')->getData();
        foreach ($initMoistureData as $data) {
            $initMoistureMeasurement_record->addData($data);
        }
        $initMoistureMeasurement->addRecord($initMoistureMeasurement_record);
        $run->setInitMoistureMeasurement($initMoistureMeasurement);

        $rainIntensityMeasurement = new Measurement();
        $rainIntensityMeasurement->setRun($run);
        $rainIntensityMeasurement->setDescriptionCZ('intenzita srážky');
        $rainIntensityMeasurement->setDescriptionEN('rain intensity');
        $rainIntensityMeasurement_record = new Record();
        $rainIntensityMeasurement_record->setRecordType($this->recordTypeRepository->find(5));
        $rainIntensityMeasurement_record->setUnit($this->unitRepository->find(6));

        $rainIntensityData = $formRun->get('rainIntensityData')->getData();
        foreach ($rainIntensityData as $data) {
            $rainIntensityMeasurement_record->addData($data);
        }
        $rainIntensityMeasurement->addRecord($rainIntensityMeasurement_record);
        $run->setRainIntensityMeasurement($rainIntensityMeasurement);

        $run->addMeasurement($initMoistureMeasurement);
        $run->addMeasurement($rainIntensityMeasurement);

        $this->entityManager->persist($run);
       /* dump($run);
        exit;*/
        $this->entityManager->flush();
    }
}
