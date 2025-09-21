<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\OperationType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OperationType>
 * @method OperationType|null find($id, $lockMode = null, $lockVersion = null)
 * @method OperationType|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<OperationType> findAll()
 * @method array<OperationType> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OperationTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OperationType::class);
    }
}
