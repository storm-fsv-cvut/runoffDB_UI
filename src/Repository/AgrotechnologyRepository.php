<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Agrotechnology;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Agrotechnology|null find($id, $lockMode = null, $lockVersion = null)
 * @method Agrotechnology|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Agrotechnology> findAll()
 * @method array<Agrotechnology> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AgrotechnologyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Agrotechnology::class);
    }
}
