<?php

namespace App\Repository;

use App\Entity\WrbSoilClass;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method WrbSoilClass|null find($id, $lockMode = null, $lockVersion = null)
 * @method WrbSoilClass|null findOneBy(array $criteria, array $orderBy = null)
 * @method WrbSoilClass[]    findAll()
 * @method WrbSoilClass[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WrbSoilClass::class);
    }

    // /**
    //  * @return WrbSoilClass[] Returns an array of WrbSoilClass objects
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
    public function findOneBySomeField($value): ?WrbSoilClass
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
