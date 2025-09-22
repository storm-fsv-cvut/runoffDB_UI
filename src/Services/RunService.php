<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Run;
use App\Entity\Sequence;
use App\Entity\SoilSample;
use App\Repository\RunRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class RunService
{
    /** @var EntityManagerInterface */
    private $entityManager;

    /** @var RunRepository */
    private $runRepository;

    /** @var ParameterBagInterface */
    private $parameterBag;

    /** @var Filesystem */
    private $filesystem;

    public function __construct(EntityManagerInterface $entityManager, RunRepository $runRepository, ParameterBagInterface $parameterBag, Filesystem $filesystem)
    {
        $this->entityManager = $entityManager;
        $this->runRepository = $runRepository;
        $this->parameterBag = $parameterBag;
        $this->filesystem = $filesystem;
    }

    public function addRun(FormInterface $formRun, Sequence $sequence): void
    {
        $run = $formRun->getData();
        $run->setSequence($sequence);
        $this->entityManager->persist($run);
        $this->entityManager->flush();
    }

    public function uploadFile(UploadedFile $file, Run $run): void
    {
        $dir = $this->parameterBag->get('kernel.project_dir') . '/public/data/run/' . $run->getId() . '/';
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }

    public function getRecordsByPhenomenon(Run $run, string $phenomenonKey): array
    {
        $measurements = $run->getMeasurements();
        $res = [];
        foreach ($measurements as $measurement) {
            if ($measurement->getPhenomenon() !== null && $measurement->getPhenomenon()->getPhenomenonKey() === $phenomenonKey) {
                $res += $measurement->getRecords()->toArray();
            }
        }
        return $res;
    }

    public function findBySoilSample(SoilSample $soilSample): array
    {
        return $this->runRepository->findBySoilSample($soilSample);
    }
}
