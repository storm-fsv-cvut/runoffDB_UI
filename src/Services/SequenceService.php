<?php


namespace App\Services;


use App\Entity\Sequence;
use App\Repository\SequenceRepository;
use App\Repository\TillageSequenceRepository;
use Symfony\Component\Translation\Translator;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceService {
    /**
     * @var SequenceRepository
     */
    private $sequenceRepository;
    /**
     * @var TillageSequenceRepository
     */
    private $tillageSequenceRepository;
    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(SequenceRepository $sequenceRepository, TillageSequenceRepository $tillageSequenceRepository, TranslatorInterface $translator) {
        $this->sequenceRepository = $sequenceRepository;
        $this->tillageSequenceRepository = $tillageSequenceRepository;
        $this->translator = $translator;
    }

    public function getRunsArray(Sequence $sequence):array {
        $runsArray = [];
        $runs = $sequence->getRuns();
        foreach ($runs as $run) {

            if (
                $run->getRainIntensityMeasurement() != null &&
                $run->getRainIntensityMeasurement()->getRecords() != null &&
                $run->getRainIntensityMeasurement()->getRecords()->get(0)->getData()->get(0) != null
            ) {
                $rain_intensity = $run->getRainIntensityMeasurement()->getRecords()->get(0)->getData()->get(0)->getValue();
                } else {
                $rain_intensity = "";
            }

           if (
                $run->getInitMoistureMeasurement() != null &&
                $run->getInitMoistureMeasurement()->getRecords() != null &&
                $run->getInitMoistureMeasurement()->getRecords()->get(0)->getData()->get(0) != null
            ) {
                $init_moisture = $run->getInitMoistureMeasurement()->getRecords()->get(0)->getData()->get(0)->getValue();
            } else {
                $init_moisture = "";
            }

            $runArray = [
                'id'=>$run->getId(),
                'run_type'=>$run->getRunType()->getNameCZ(),
                'rain_start' => $run->getDatetime()->format("H:i"),
                'runoff_start'=> $run->getRunoffStart()->format("H:i"),
                'soil_sample_texture'=> $run->getSoilSampleTexture(),
                'soil_sample_texture_assignment'=> $run->getTextureAssignmentType(),
                'soil_sample_bulk'=> $run->getSoilSampleBulk(),
                'soil_sample_bulk_assignment'=> $run->getBulkAssignmentType(),
                'soil_sample_corq'=> $run->getSoilSampleCorq(),
                'rain_intensity'=> $rain_intensity,
                'init_moisture'=> $init_moisture,
                'soil_sample_corq_assignment'=> $run->getCorqAssignmentType()
            ];

            $measurements = $run->getMeasurements();
            $measurementsArray = [];

            foreach ($measurements as $measurement) {
                $measurementArray = [
                    'id' =>$measurement->getId(),
                    'note' =>$measurement->getNoteCZ(),
                    'description'=> $measurement->getDescriptionCZ(),
                    'records'=>$measurement->getRecords()
                ];
                $measurementsArray[$measurement->getId()]=$measurementArray;
            }
            $runArray['measurements'] = $measurementsArray;
            $runsArray[$run->getId()]=$runArray;
        }
        return $runsArray;
    }

    public function getSequenceById(int $id):Sequence{
        return $this->sequenceRepository->find($id);
    }

    public function getSequenceHeader(Sequence $sequence):array {
        $plot = $sequence->getPlot();
        $locality = $plot->getLocality();
        $agrotechnology = $plot->getAgrotechnology();
        $tillageSequences = $agrotechnology->getTillageSequences();
        $daysFromLastAgro = 100000000;
        foreach ($tillageSequences as $tillageSequence) {
            $days = $sequence->getDate()->diff($tillageSequence->getDate())->days;
            $daysFromLastAgro = $daysFromLastAgro > $days ? $days : $daysFromLastAgro;
        }
        return [
            'id'=>$sequence->getId(),
            'date'=>$sequence->getDate()->format("d.m.Y"),
            'locality'=>$locality->getName(),
            'crop'=>$plot->getCrop()->getNameCZ(),
            'agrotechnology'=>$agrotechnology->getNameCZ(),
            'last_agrooperation_days'=>$daysFromLastAgro,
            'canopy_cover' => $sequence->getCanopyCover(),
            'crop_bbch' => $sequence->getCropBBCH()
        ];
    }

}
