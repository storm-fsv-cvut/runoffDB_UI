<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\OperationIntensity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OperationIntensity>
 * @method OperationIntensity|null find($id, $lockMode = null, $lockVersion = null)
 * @method OperationIntensity|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<OperationIntensity> findAll()
 * @method array<OperationIntensity> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OperationIntensityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OperationIntensity::class);
    }
}
