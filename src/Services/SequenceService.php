<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Sequence;
use App\Repository\SequenceRepository;
use DOMDocument;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

class SequenceService
{
    /** @var SequenceRepository */
    private $sequenceRepository;

    /** @var RequestStack */
    private $requestStack;
    private ParameterBagInterface $parameterBag;
    private Filesystem $filesystem;

    public function __construct(
        SequenceRepository $sequenceRepository,
        RequestStack $requestStack,
        ParameterBagInterface $parameterBag,
        Filesystem $filesystem,
    ) {
        $this->sequenceRepository = $sequenceRepository;
        $this->requestStack = $requestStack;
        if ($this->requestStack->getCurrentRequest() === null) {
            throw new Exception('Invalid request');
        }
        $this->parameterBag = $parameterBag;
        $this->filesystem = $filesystem;
    }

    public function getRunsArray(Sequence $sequence): array
    {
        $runsArray = [];
        $runs = $sequence->getRuns();
        if ($runs !== null) {
            foreach ($runs as $run) {
                if ($run->getRainIntensity() !== null &&
                    $run->getRainIntensity()->getData()->get(0) !== null
                ) {
                    $rain_intensity = $run->getRainIntensity()->getHtmlLabel();
                } else {
                    $rain_intensity = '';
                }

                if ($run->getInitMoisture() !== null &&
                    $run->getInitMoisture()->getData()->get(0) !== null
                ) {
                    $init_moisture = $run->getInitMoisture()->getHtmlLabel();
                } else {
                    $init_moisture = '';
                }

                $runArray = [
                    'id' => $run->getId(),
                    'runoff_start' => $run->getRunoffStart() !== null ? $run->getRunoffStart()->format('H:i:s') : '',
                    'ponding_start' => $run->getPondingStart() !== null ? $run->getPondingStart()->format('H:i:s') : '',
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
                    'files' => $run->getFiles(),
                ];

                $measurements = $run->getMeasurements();
                $measurementsArray = [];

                foreach ($measurements as $measurement) {
                    $measurementArray = [
                        'id' => $measurement->getId(),
                        'note' => $measurement->getNote(),
                        'description' => $measurement->getDescription(),
                        'records' => $measurement->getRecords(),
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
            $projects .= $project->getProjectName() . ' ';
        }
        return [
            'id' => $sequence->getId(),
            'date' => $sequence->getFormatedDate(),
            'simulator' => $sequence->getSimulator(),
            'organization' => $sequence->getSimulator(),
            'projects' => $projects,
            'locality' => $locality !== null ? $locality->getName() : ' n/a ',
        ];
    }

    public function exportSequence(
        int $id,
    ): string {
        $sequence = $this->getSequenceById($id);
        $dom = new DOMDocument();
        $dom->encoding = 'utf-8';
        $dom->xmlVersion = '1.0';
        $dom->formatOutput = true;
        $dom->append($sequence->getXmlDomElement($dom));
        return $dom->saveXML();
    }

    public function getSequenceById(int $id): Sequence
    {
        $sequence = $this->sequenceRepository->find($id);
        if ($sequence === null) {
            throw new Exception("Sequence doesn't exist:" . $id);
        }
        return $this->sequenceRepository->find($id);
    }

    public function exportSequences(array $sequences): string
    {
        $dom = new DOMDocument();
        $dom->encoding = 'utf-8';
        $dom->xmlVersion = '1.0';
        $dom->formatOutput = true;
        $sequencesDom = $dom->createElement('sequences');
        /** @var Sequence $sequence */
        foreach ($sequences as $sequence) {
            $sequencesDom->append($sequence->getXmlDomElement($dom));
        }

        $dom->append($sequencesDom);
        return $dom->saveXML();
    }

    public function uploadFile(UploadedFile $file, Sequence $sequence): void
    {
        $dir = $this->parameterBag->get('kernel.project_dir') . '/public/' . $sequence->getFilesPath();
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }
}
