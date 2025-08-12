<?php

namespace App\Repository;

use App\Entity\ProcessingStep;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProcessingStep>
 */
class ProcessingStepRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProcessingStep::class);
    }

    public function createSortedQueryBuilder()
    {
        return $this->createQueryBuilder('ps')
                    ->orderBy('ps.stepOrder', 'ASC')
                    ->addOrderBy('ps.nameCZ', 'ASC');
    }

    public function findAllSorted(): array
    {
        return $this->createSortedQueryBuilder()
                    ->getQuery()
                    ->getResult();
    }
}
