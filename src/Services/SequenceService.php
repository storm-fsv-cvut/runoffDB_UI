<?php


namespace App\Services;


use App\Entity\Sequence;
use App\Repository\RunRepository;
use App\Repository\SequenceRepository;
use App\Repository\TillageSequenceRepository;
use DOMDocument;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceService
{
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
     * @var RunRepository
     */
    private $runRepository;

    /**
     * @var string
     */
    private $locale;

    public function __construct(
        SequenceRepository $sequenceRepository,
        TillageSequenceRepository $tillageSequenceRepository,
        TranslatorInterface $translator,
        RequestStack $requestStack,
        RunRepository $runRepository
    ) {
        $this->sequenceRepository = $sequenceRepository;
        $this->tillageSequenceRepository = $tillageSequenceRepository;
        $this->runRepository = $runRepository;
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        if ($this->requestStack->getCurrentRequest() === null) {
            throw new Exception('Invalid request');
        }

        $this->locale = $this->requestStack->getCurrentRequest()->getLocale();
    }

    public function getRunsArray(Sequence $sequence): array
    {
        $runsArray = [];
        $runs = $sequence->getRuns();
        if ($runs !== null) {
            foreach ($runs as $run) {
                if (
                    $run->getRainIntensity() !== null &&
                    $run->getRainIntensity()->getData()->get(0) !== null
                ) {
                    $rain_intensity = $run->getRainIntensity()->getHtmlLabel();
                } else {
                    $rain_intensity = "";
                }

                if (
                    $run->getInitMoisture() !== null &&
                    $run->getInitMoisture()->getData()->get(0) !== null
                ) {
                    $init_moisture = $run->getInitMoisture()->getHtmlLabel();
                } else {
                    $init_moisture = "";
                }

                $runArray = [
                    'id' => $run->getId(),
                    'runoff_start' => $run->getRunoffStart() !== null ? $run->getRunoffStart()->format("H:i:s") : "",
                    'ponding_start' => $run->getPondingStart() !== null ? $run->getPondingStart()->format("H:i:s") : "",
                    'soil_sample_texture' => $run->getSoilSampleTexture(),
                    'soil_sample_texture_assignment' => $run->getTextureAssignmentType(),
                    'soil_sample_bulk' => $run->getSoilSampleBulk(),
                    'soil_sample_bulk_assignment' => $run->getBulkAssignmentType(),
                    'soil_sample_corg' => $run->getSoilSampleCorg(),
                    'canopy_cover' => $run->getSurfaceCover(),
                    'crop_bbch' => $run->getCropBBCH(),
                    'crop_condition' => $run->getCropCondition(),
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
        }
        return $runsArray;
    }

    public function getSequenceHeader(Sequence $sequence): array
    {
        $locality = $sequence->getLocality();
        $projects = null;
        foreach ($sequence->getProjects() as $project) {
            $projects .= $project->getProjectName() . " ";
        }
        return [
            'id' => $sequence->getId(),
            'date' => $sequence->getFormatedDate(),
            'simulator' => $sequence->getSimulator(),
            'organization' => $sequence->getSimulator(),
            'projects' => $projects,
            'locality' => $locality !== null ? $locality->getName() : " n/a "
        ];
    }

    public function exportSequence(
        int $id
    ): string {
        $sequence = $this->getSequenceById($id);
        $dom = new DOMDocument();
        $dom->encoding = 'utf-8';
        $dom->xmlVersion = '1.0';
        $dom->formatOutput = true;
        $dom->append($sequence->getXmlDomElement($dom));
        $xmlString = $dom->saveXML();
        return $xmlString;
    }

    public function getSequenceById(int $id): Sequence
    {
        $sequence = $this->sequenceRepository->find($id);
        if ($sequence === null) {
            throw new Exception("Sequence doesn't exist:" . $id);
        }
        return $this->sequenceRepository->find($id);
    }

}
