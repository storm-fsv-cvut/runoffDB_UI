<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\TillageSequence;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TillageSequence>
 * @method TillageSequence|null find($id, $lockMode = null, $lockVersion = null)
 * @method TillageSequence|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<TillageSequence> findAll()
 * @method array<TillageSequence> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TillageSequenceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TillageSequence::class);
    }
}
