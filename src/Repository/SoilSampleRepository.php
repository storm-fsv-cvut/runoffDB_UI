<?php

namespace App\Repository;

use App\Entity\SoilSample;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SoilSample|null find($id, $lockMode = null, $lockVersion = null)
 * @method SoilSample|null findOneBy(array $criteria, array $orderBy = null)
 * @method SoilSample[]    findAll()
 * @method SoilSample[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilSampleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SoilSample::class);
    }

    // /**
    //  * @return SoilSample[] Returns an array of SoilSample objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SoilSample
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
