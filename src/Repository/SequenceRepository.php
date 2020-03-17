<?php

namespace App\Repository;

use App\Entity\Sequence;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Sequence|null find($id, $lockMode = null, $lockVersion = null)
 * @method Sequence|null findOneBy(array $criteria, array $orderBy = null)
 * @method Sequence[]    findAll()
 * @method Sequence[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SequenceRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Sequence::class);
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('sequence');
      /*  $expr = $queryBuilder->expr();
        if (isset($filter['plot']) && $filter['plot']) {
            $queryBuilder->andWhere()->add('where',$queryBuilder->expr()->eq('sequence.plot',$filter['plot']->getId()));
        }
        if (isset($filter['date']) && $filter['date']) {
            $queryBuilder->andWhere()->add('where',$queryBuilder->expr()->eq('sequence.date',"'".$filter['date']->format("Y-m-d")."'"));
        }

        echo $queryBuilder;*/
        return $queryBuilder;
    }

}
