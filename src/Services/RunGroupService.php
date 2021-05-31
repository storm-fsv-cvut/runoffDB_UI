<?php


namespace App\Services;


use App\Entity\Sequence;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormInterface;

class RunGroupService {
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
    }

    public function addRunGroup(FormInterface $formRunGroup, Sequence $sequence):void {
        $runGroup = $formRunGroup->getData();
        $runGroup->setSequence($sequence);
        $this->entityManager->persist($runGroup);
        $this->entityManager->flush();
    }
}
