<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RunType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RunType>
 * @method RunType|null find($id, $lockMode = null, $lockVersion = null)
 * @method RunType|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<RunType> findAll()
 * @method array<RunType> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RunTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RunType::class);
    }
}
