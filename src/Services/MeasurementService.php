<?php


namespace App\Services;


use App\Entity\Measurement;
use App\Entity\Run;
use App\Repository\MeasurementRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MeasurementService
{
    private MeasurementRepository $measurementRepository;
    private EntityManagerInterface $entityManager;
    private ParameterBagInterface $parameterBag;
    private Filesystem $filesystem;

    public function __construct(
        MeasurementRepository $measurementRepository,
        EntityManagerInterface $entityManager,
        ParameterBagInterface $parameterBag,
        Filesystem $filesystem
    ) {
        $this->measurementRepository = $measurementRepository;
        $this->entityManager = $entityManager;
        $this->parameterBag = $parameterBag;
        $this->filesystem = $filesystem;
    }

    public function getMeasurementById(int $id): ?Measurement
    {
        return $this->measurementRepository->find($id);
    }

    public function generateDetails(): void
    {
        $measurements = $this->measurementRepository->findAll();
        foreach ($measurements as $measurement) {
            $changed = false;
            $run = null;
            $soilSample = null;
            foreach ($measurement->getRuns() as $r) {
                $run = $r;
                break;
            }
            foreach ($measurement->getSoilSamples() as $s) {
                $soilSample = $s;
                break;
            }
            if ($measurement->getLocality() === null) {
                if ($run !== null && $run->getSequence() !== null) {
                    $changed = true;
                    $measurement->setLocality($run->getSequence()->getLocality());
                } elseif ($soilSample !== null && $soilSample->getLocality() !== null) {
                    $changed = true;
                    $measurement->setLocality($soilSample->getLocality());
                }
            }

            if ($measurement->getPlot() === null) {
                if ($run !== null) {
                    $changed = true;
                    $measurement->setPlot($run->getPlot());
                } elseif ($soilSample !== null) {
                    $changed = true;
                    $measurement->setPlot($soilSample->getPlot());
                }
            }

            if ($measurement->getDate() === null) {
                if ($run !== null && $run->getSequence() !== null) {
                    $changed = true;
                    $measurement->setDate($run->getSequence()->getDate());
                } elseif ($soilSample !== null) {
                    $changed = true;
                    $measurement->setDate($soilSample->getDateSampled());
                }
            }
            if ($changed) {
                $this->entityManager->persist($measurement);
                $this->entityManager->flush();
            }
        }
    }

    public function switchBelongsToRun(Measurement $measurement, Run $run): bool
    {
        if ($measurement->belongsToRun($run->getId())) {
            $measurement->removeRun($run);
        } else {
            $measurement->addRun($run);
        }
        $this->entityManager->persist($measurement);
        $this->entityManager->flush();
        return $measurement->belongsToRun($run->getId());
    }

    public function deleteMeasurement(int $id): void
    {
        $measurement = $this->measurementRepository->find($id);
        if ($measurement !== null) {
            foreach ($measurement->getRecords() as $record) {
                foreach ($record->getData() as $data) {
                    $this->entityManager->remove($data);
                }
                $this->entityManager->flush();
                $this->entityManager->remove($record);
            }
            $this->entityManager->remove($measurement);
            $this->entityManager->flush();
        }
    }

    public function uploadFile(UploadedFile $file, Measurement $measurement): void
    {
        $dir = $this->parameterBag->get('kernel.project_dir') . "/public/data/measurement/" . $measurement->getId();
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }
}
