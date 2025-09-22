<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Measurement;
use App\Entity\Phenomenon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Measurement>
 * @method Measurement|null find($id, $lockMode = null, $lockVersion = null)
 * @method Measurement|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Measurement> findAll()
 * @method array<Measurement> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MeasurementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Measurement::class);
    }

     /**
      * @return array<Measurement> Returns an array of Measurement objects
      */
    public function findByPhenomenon(Phenomenon $phenomenon)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.phenomenon = :val')
            ->setParameter('val', $phenomenon)
            ->orderBy('m.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('measurement');
        $queryBuilder->leftJoin('measurement.phenomenon', 'p', 'WITH', 'measurement.phenomenon = p.id');
        $queryBuilder->leftJoin('measurement.locality', 'l', 'WITH', 'measurement.locality = l.id');
        $queryBuilder->leftJoin('measurement.runs', 'r');
        $queryBuilder->leftJoin('r.runGroup', 'rg');
        $queryBuilder->leftJoin('rg.sequence', 's');
        $queryBuilder->leftJoin('s.simulator', 'si');
        if (isset($filter['dateFrom']) && $filter['dateFrom']) {
            $queryBuilder->andWhere($queryBuilder->expr()->gte('measurement.date', "'" . $filter['dateFrom']->format('Y-m-d') . "'"));
        }
        if (isset($filter['dateTo']) && $filter['dateTo']) {
            $queryBuilder->andWhere($queryBuilder->expr()->lte('measurement.date', "'" . $filter['dateTo']->format('Y-m-d') . "'"));
        }
        if (isset($filter['organization']) && $filter['organization']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('l.organization', $filter['organization']->getId()));
        }
        if (isset($filter['locality']) && $filter['locality']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('measurement.locality', $filter['locality']->getId()));
        }
        if (isset($filter['phenomenon']) && $filter['phenomenon']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('measurement.phenomenon', $filter['phenomenon']->getId()));
        }
        return $queryBuilder;
    }
}
