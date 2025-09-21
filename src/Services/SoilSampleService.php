<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\SoilSample;
use App\Repository\SoilSampleRepository;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

class SoilSampleService
{
    /** @var RequestStack */
    private $requestStack;

    /** @var SoilSampleRepository */
    private $soilSampleRepository;

    /** @var ParameterBagInterface */
    private $parameterBag;

    /** @var Filesystem */
    private $filesystem;

    public function __construct(RequestStack $requestStack, SoilSampleRepository $soilSampleRepository, ParameterBagInterface $parameterBag, Filesystem $filesystem)
    {
        $this->requestStack = $requestStack;
        if ($this->requestStack->getCurrentRequest() === null) {
            throw new Exception('Invalid request');
        }
        $this->soilSampleRepository = $soilSampleRepository;
        $this->parameterBag = $parameterBag;
        $this->filesystem = $filesystem;
    }

    public function getMeasurementsArray(SoilSample $soilSample): array
    {
        $measurements = $soilSample->getMeasurements();
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
        return $measurementsArray;
    }

    public function getSoilSampleById(int $id): ?SoilSample
    {
        return $this->soilSampleRepository->find($id);
    }

    public function uploadFile(UploadedFile $file, SoilSample $soilSample): void
    {
        $dir = $this->parameterBag->get('kernel.project_dir') . '/public/' . $soilSample->getFilesPath();
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }

    public function getRecordsByPhenomenon(SoilSample $soilSample, string $phenomenonKey): array
    {
        $measurements = $soilSample->getMeasurements();
        $res = [];
        foreach ($measurements as $measurement) {
            if ($measurement->getPhenomenon() !== null) {
                if ($measurement->getPhenomenon()->getPhenomenonKey() === $phenomenonKey) {
                    $res += $measurement->getRecords()->toArray();
                }
            }
        }
        return $res;
    }
}
