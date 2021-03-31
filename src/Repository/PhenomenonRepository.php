<?php

namespace App\Repository;

use App\Entity\Phenomenon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Phenomenon|null find($id, $lockMode = null, $lockVersion = null)
 * @method Phenomenon|null findOneBy(array $criteria, array $orderBy = null)
 * @method Phenomenon[]    findAll()
 * @method Phenomenon[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhenomenonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Phenomenon::class);
    }

    public function findByKey(string $key): ?Phenomenon
    {
        $res =  $this->createQueryBuilder('p')
            ->andWhere('p.phenomenonKey = :val')
            ->setParameter('val', $key)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getResult()
        ;

        return $res[0] ?? NULL;
    }

}
