<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\QualityIndex;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QualityIndex>
 * @method QualityIndex|null find($id, $lockMode = null, $lockVersion = null)
 * @method QualityIndex|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<QualityIndex> findAll()
 * @method array<QualityIndex> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QualityIndexRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QualityIndex::class);
    }
}
