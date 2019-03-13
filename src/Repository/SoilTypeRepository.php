<?php

namespace App\Repository;

use App\Entity\SoilType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SoilType|null find($id, $lockMode = null, $lockVersion = null)
 * @method SoilType|null findOneBy(array $criteria, array $orderBy = null)
 * @method SoilType[]    findAll()
 * @method SoilType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SoilType::class);
    }

    // /**
    //  * @return SoilType[] Returns an array of SoilType objects
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
    public function findOneBySomeField($value): ?SoilType
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
