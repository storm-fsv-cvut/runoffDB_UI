<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Run;
use App\Entity\SoilSample;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Run>
 * @method Run|null find($id, $lockMode = null, $lockVersion = null)
 * @method Run|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Run> findAll()
 * @method array<Run> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RunRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Run::class);
    }

    public function findBySoilSample(SoilSample $soilSample): array
    {
        $qb = $this->createQueryBuilder('s');
        $qb->andWhere(
            $qb->expr()->orX(
                $qb->expr()->eq('s.soilSampleBulk', $soilSample->getId()),
                $qb->expr()->eq('s.soilSampleTexture', $soilSample->getId()),
                $qb->expr()->eq('s.soilSampleCorg', $soilSample->getId()),
            ),
        );

        return $qb->getQuery()->getResult();
    }
}
