<?php

namespace App\Repository;

use App\Entity\WRBsoilClass;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method WRBsoilClass|null find($id, $lockMode = null, $lockVersion = null)
 * @method WRBsoilClass|null findOneBy(array $criteria, array $orderBy = null)
 * @method WRBsoilClass[]    findAll()
 * @method WRBsoilClass[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, WRBsoilClass::class);
    }

    // /**
    //  * @return WRBsoilClass[] Returns an array of WRBsoilClass objects
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
    public function findOneBySomeField($value): ?WRBsoilClass
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
