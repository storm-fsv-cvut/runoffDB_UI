<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Data;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Data>
 * @method Data|null find($id, $lockMode = null, $lockVersion = null)
 * @method Data|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Data> findAll()
 * @method array<Data> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Data::class);
    }
}
