<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Measurement;
use App\Entity\RunGroup;
use App\Entity\Sequence;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormInterface;

class RunGroupService
{
    /** @var EntityManagerInterface */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function addRunGroup(FormInterface $formRunGroup, Sequence $sequence): void
    {
        $runGroup = $formRunGroup->getData();
        $runGroup->setSequence($sequence);
        $this->entityManager->persist($runGroup);
        $this->entityManager->flush();
    }

    public function deleteRunGroupFromForm(RunGroup $runGroup, array $measurementIdsToDelete): void
    {
        foreach ($runGroup->getRuns() as $run) {
            /** @var Measurement $measurement */
            foreach ($run->getMeasurements() as $measurement) {
                if (isset($measurementIdsToDelete[$measurement->getId()]) && $measurementIdsToDelete[$measurement->getId()] === true) {
                    $run->removeMeasurement($measurement);
                    $measurement->removeRun($run);
                    $this->entityManager->persist($measurement);
                    $this->entityManager->persist($run);

                    $this->entityManager->remove($measurement);
                } else {
                    $run->removeMeasurement($measurement);
                    $measurement->removeRun($run);
                    $this->entityManager->persist($measurement);
                    $this->entityManager->persist($run);
                }
            }

            $this->entityManager->remove($run);
        }

        $this->entityManager->remove($runGroup);
        $this->entityManager->flush();
    }
}
