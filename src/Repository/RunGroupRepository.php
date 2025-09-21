<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RunGroup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RunGroup>
 * @method RunGroup|null find($id, $lockMode = null, $lockVersion = null)
 * @method RunGroup|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<RunGroup> findAll()
 * @method array<RunGroup> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RunGroupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RunGroup::class);
    }
}
