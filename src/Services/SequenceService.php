<?php


namespace App\Services;


use _HumbugBoxcbe25c660cef\Nette\Neon\Exception;
use App\Entity\Sequence;
use App\Repository\SequenceRepository;
use App\Repository\TillageSequenceRepository;
use Symfony\Component\HttpFoundation\RequestStack;
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

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @var string
     */
    private $locale;

    public function __construct(SequenceRepository $sequenceRepository, TillageSequenceRepository $tillageSequenceRepository, TranslatorInterface $translator, RequestStack $requestStack) {
        $this->sequenceRepository = $sequenceRepository;
        $this->tillageSequenceRepository = $tillageSequenceRepository;
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        if ($this->requestStack->getCurrentRequest()===null) {
            throw new Exception('Invalid request');
        }
        $this->locale = $this->requestStack->getCurrentRequest()->getLocale()!==null ? $this->requestStack->getCurrentRequest()->getLocale() : $this->requestStack->getCurrentRequest()->getDefaultLocale();
    }

    public function getRunsArray(Sequence $sequence): array {
        $runsArray = [];
        $runs = $sequence->getRuns();
        foreach ($runs as $run) {
            if (
                $run->getRainIntensity() != null &&
                $run->getRainIntensity()->getData()->get(0) != null
            ) {
                $rain_intensity = number_format($run->getRainIntensity()->getData()->get(0)->getValue(), 0) . " " . $run->getRainIntensity()->getUnit()->getUnit();
            } else {
                $rain_intensity = "";
            }

            if (
                $run->getInitMoisture() != null &&
                $run->getInitMoisture()->getData()->get(0) != null
            ) {
                $init_moisture = number_format($run->getInitMoisture()->getData()->get(0)->getValue(), 0) . " " . $run->getInitMoisture()->getUnit()->getUnit();
            } else {
                $init_moisture = "";
            }

            $runArray = [
                'id' => $run->getId(),
                'runoff_start' => $run->getRunoffStart() ? $run->getRunoffStart()->format("H:i") : "",
                'ponding_start' => $run->getPondingStart() ? $run->getPondingStart()->format("H:i") : "",
                'soil_sample_texture' => $run->getSoilSampleTexture(),
                'soil_sample_texture_assignment' => $run->getTextureAssignmentType(),
                'soil_sample_bulk' => $run->getSoilSampleBulk(),
                'soil_sample_bulk_assignment' => $run->getBulkAssignmentType(),
                'soil_sample_corg' => $run->getSoilSampleCorg(),
                'note' => $run->getNote(),
                'rain_intensity' => $rain_intensity,
                'init_moisture' => $init_moisture,
                'soil_sample_corg_assignment' => $run->getCorgAssignmentType(),
                'files' => $run->getFiles()
            ];

            $measurements = $run->getMeasurements();
            $measurementsArray = [];

            foreach ($measurements as $measurement) {
                $measurementArray = [
                    'id' => $measurement->getId(),
                    'note' => $measurement->getNote(),
                    'description' => $measurement->getDescription(),
                    'records' => $measurement->getRecords()
                ];
                $measurementsArray[$measurement->getId()] = $measurementArray;
            }
            $runArray['measurements'] = $measurementsArray;
            $runsArray[$run->getId()] = $runArray;
        }
        return $runsArray;
    }

    public function getSequenceById(int $id): Sequence {
        return $this->sequenceRepository->find($id);
    }

    public function getSequenceHeader(Sequence $sequence): array {
        $locality = $sequence->getLocality();
        return [
            'id' => $sequence->getId(),
            'date' => $sequence->getFormatedDate(),
            'simulator' => $sequence->getSimulator(),
            'locality' => $locality ? $locality->getName() : " n/a ",
            'canopy_cover' => $sequence->getSurfaceCover(),
            'crop_bbch' => $sequence->getCropBBCH(),
            'crop_condition' => $sequence->getCropCondition()
        ];
    }

}
