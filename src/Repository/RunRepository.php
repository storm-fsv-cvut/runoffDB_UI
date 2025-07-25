<?php

namespace App\Repository;

use App\Entity\Run;
use App\Entity\SoilSample;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Run|null find($id, $lockMode = null, $lockVersion = null)
 * @method Run|null findOneBy(array $criteria, array $orderBy = null)
 * @method Run[]    findAll()
 * @method Run[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RunRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Run::class);
    }

    // /**
    //  * @return Run[] Returns an array of Run objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Run
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    public function findBySoilSample(SoilSample $soilSample): array
    {
        $qb = $this->createQueryBuilder('s');
        $qb->andWhere(
            $qb->expr()->orX(
                $qb->expr()->eq('s.soilSampleBulk',$soilSample->getId()),
                $qb->expr()->eq('s.soilSampleTexture',$soilSample->getId()),
                $qb->expr()->eq('s.soilSampleCorg',$soilSample->getId())
            )
        );

        return $qb->getQuery()->getResult();
    }

}
