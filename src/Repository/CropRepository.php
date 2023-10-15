<?php

namespace App\Repository;

use App\Entity\Crop;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Crop|null find($id, $lockMode = null, $lockVersion = null)
 * @method Crop|null findOneBy(array $criteria, array $orderBy = null)
 * @method Crop[]    findAll()
 * @method Crop[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CropRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Crop::class);
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('crop');
        $queryBuilder->leftJoin('crop.cropType', 'ct', 'WITH', 'crop.cropType = ct.id');

        if(isset($filter['cropType'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('crop.cropType',':cropType'))->setParameter('cropType',$filter['cropType']);
        }
        if(isset($filter['name'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->like('crop.nameCZ',':name'))
                         ->orWhere($queryBuilder->expr()->like('crop.nameEN',':name'))
                         ->setParameter('name','%'.$filter['name'].'%');
        }
        return $queryBuilder;
    }

    // /**
    //  * @return Crop[] Returns an array of Crop objects
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
    public function findOneBySomeField($value): ?Crop
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
