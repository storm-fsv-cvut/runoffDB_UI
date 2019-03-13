<?php

namespace App\Repository;

use App\Entity\CropType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CropType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CropType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CropType[]    findAll()
 * @method CropType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CropTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CropType::class);
    }

    // /**
    //  * @return CropType[] Returns an array of CropType objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CropType
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
