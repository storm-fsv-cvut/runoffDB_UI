<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Simulator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Simulator>
 * @method Simulator|null find($id, $lockMode = null, $lockVersion = null)
 * @method Simulator|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Simulator> findAll()
 * @method array<Simulator> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SimulatorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Simulator::class);
    }
}
