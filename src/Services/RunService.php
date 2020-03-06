<?php


namespace App\Services;
use App\Entity\Measurement;
use App\Entity\Record;
use App\Entity\RecordType;
use App\Entity\Run;
use App\Entity\Sequence;
use App\Repository\RecordTypeRepository;
use App\Repository\RunRepository;
use App\Repository\UnitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
    /**
     * @var ParameterBagInterface
     */
    private $parameterBag;
    /**
     * @var Filesystem
     */
    private $filesystem;

    public function __construct(EntityManagerInterface $entityManager, RecordTypeRepository $recordTypeRepository, UnitRepository $unitRepository, RunRepository $runRepository, ParameterBagInterface $parameterBag, Filesystem $filesystem) {
        $this->entityManager = $entityManager;
        $this->recordTypeRepository = $recordTypeRepository;
        $this->unitRepository = $unitRepository;
        $this->runRepository = $runRepository;
        $this->parameterBag = $parameterBag;
        $this->filesystem = $filesystem;
    }

    public function addRun(FormInterface $formRun, Sequence $sequence) {
        $run = $formRun->getData();
        $run->setSequence($sequence);
        $this->entityManager->persist($run);

        $initMoistureData = $formRun->get('initMoistureData')->getData();
        if (sizeof($initMoistureData)) {
            $initMoistureMeasurement = new Measurement();
            $initMoistureMeasurement->setRun($run);
            $initMoistureMeasurement->setDescriptionCZ('vlhkost');
            $initMoistureMeasurement->setDescriptionEN('moisture');
            $initMoistureMeasurement_record = new Record();
            $initMoistureMeasurement_record->setRecordType($this->recordTypeRepository->find(5));
            $initMoistureMeasurement_record->setUnit($this->unitRepository->find(6));
            foreach ($initMoistureData as $data) {
                $initMoistureMeasurement_record->addData($data);
            }
            $initMoistureMeasurement->addRecord($initMoistureMeasurement_record);
            $run->setInitMoistureMeasurement($initMoistureMeasurement);
            $run->addMeasurement($initMoistureMeasurement);
        }

        $rainIntensityData = $formRun->get('rainIntensityData')->getData();
        if (sizeof($rainIntensityData)) {
            $rainIntensityMeasurement = new Measurement();
            $rainIntensityMeasurement->setRun($run);
            $rainIntensityMeasurement->setDescriptionCZ('intenzita srážky');
            $rainIntensityMeasurement->setDescriptionEN('rain intensity');
            $rainIntensityMeasurement_record = new Record();
            $rainIntensityMeasurement_record->setRecordType($this->recordTypeRepository->find(5));
            $rainIntensityMeasurement_record->setUnit($this->unitRepository->find(6));

            foreach ($rainIntensityData as $data) {
                $rainIntensityMeasurement_record->addData($data);
            }
            $rainIntensityMeasurement->addRecord($rainIntensityMeasurement_record);
            $run->setRainIntensityMeasurement($rainIntensityMeasurement);
            $run->addMeasurement($rainIntensityMeasurement);

        }

        $this->entityManager->persist($run);
        $this->entityManager->flush();
    }

    public function uploadFile(UploadedFile $file, Run $run) {
        $dir = $this->parameterBag->get('kernel.project_dir')."/public/data/".$run->getSequence()->getId()."/".$run->getId();
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }
}
