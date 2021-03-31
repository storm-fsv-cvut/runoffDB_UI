<?php

namespace App\Repository;

use App\Entity\QualityIndex;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method QualityIndex|null find($id, $lockMode = null, $lockVersion = null)
 * @method QualityIndex|null findOneBy(array $criteria, array $orderBy = null)
 * @method QualityIndex[]    findAll()
 * @method QualityIndex[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QualityIndexRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QualityIndex::class);
    }

    // /**
    //  * @return QualityIndex[] Returns an array of QualityIndex objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('q.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?QualityIndex
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
