<?php


namespace App\Services;


use App\Entity\Measurement;
use App\Entity\Run;
use App\Repository\MeasurementRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;

class MeasurementService {

    /**
     * @var MeasurementRepository
     */
    private $measurementRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(MeasurementRepository $measurementRepository, EntityManagerInterface $entityManager) {
        $this->measurementRepository = $measurementRepository;
        $this->entityManager = $entityManager;
    }

    public function getMeasurementById(int $id):Measurement {
        return $this->measurementRepository->find($id);
    }

    public function generateDetails() {
        $measurements = $this->measurementRepository->findAll();
        foreach ($measurements as $measurement) {
            $changed = false;
            if ($measurement->getLocality() === NULL) {
                if ($measurement->getRun()!=null) {
                    $changed = true;
                    $measurement->setLocality($measurement->getRun()->getSequence()->getLocality());
                } elseif ($measurement->getSoilSample()!=null) {
                    $changed = true;
                    $measurement->setLocality($measurement->getSoilSample()->getLocality());
                }
            }

            if ($measurement->getPlot() === NULL) {
                if ($measurement->getRun()!=null) {
                    $changed = true;
                    $measurement->setPlot($measurement->getRun()->getSequence()->getPlot());
                } elseif ($measurement->getSoilSample()!=null) {
                    $changed = true;
                    $measurement->setPlot($measurement->getSoilSample()->getPlot());
                }
            }

            if ($measurement->getDate() === NULL) {
                if ($measurement->getRun()!=null) {
                    $changed = true;
                    $measurement->setDate($measurement->getRun()->getSequence()->getDate());
                } elseif ($measurement->getSoilSample()!=null) {
                    $changed = true;
                    $measurement->setDate($measurement->getSoilSample()->getDateSampled());
                }
            }
            if ($changed) {
                $this->entityManager->persist($measurement);
                $this->entityManager->flush();
            }
        }
    }

    public function switchBelongsToRun(Measurement $measurement, Run $run): bool {
        if ($measurement->belongsToRun($run->getId())) {
            $measurement->removeRun($run);
        } else {
            $measurement->addRun($run);
        }
        $this->entityManager->persist($measurement);
        $this->entityManager->flush();
        return $measurement->belongsToRun($run->getId());
    }

    public function deleteMeasurement(int $id) {
        $measurement = $this->measurementRepository->find($id);
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
