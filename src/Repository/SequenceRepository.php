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
    /**
     * @var PlotRepository
     */
    private $plotRepository;

    public function __construct(RegistryInterface $registry, PlotRepository $plotRepository)
    {
        parent::__construct($registry, Sequence::class);
        $this->plotRepository = $plotRepository;
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        //dump($filter);
        $queryBuilder = $this->createQueryBuilder('sequence');
        $queryBuilder->select('sequence');
        $queryBuilder->innerJoin('sequence.runGroups', 'rg', 'WITH', 'rg.sequence = sequence.id');
        $queryBuilder->innerJoin('rg.runs', 'r', 'WITH', 'r.runGroup = rg.id');
        $queryBuilder->andWhere($queryBuilder->expr()->isNull('sequence.deleted'));
        if (isset($filter['crop']) && $filter['crop']) {
            $plots = $this->plotRepository->findBy(['crop'=>$filter['crop']]);
            $plotsIds = [];
            foreach ($plots as $plot) {
                $plotsIds[]=$plot->getId();
            }
            $queryBuilder->andWhere($queryBuilder->expr()->in('r.plot',$plotsIds));
        }
        if (isset($filter['plot']) && $filter['plot']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('r.plot',$filter['plot']->getId()));
        }
        if (isset($filter['dateFrom']) && $filter['dateFrom']) {
            $queryBuilder->andWhere($queryBuilder->expr()->gte('sequence.date',"'".$filter['dateFrom']->format("Y-m-d")."'"));
        }
        if (isset($filter['dateTo']) && $filter['dateTo']) {
            $queryBuilder->andWhere($queryBuilder->expr()->lte('sequence.date',"'".$filter['dateTo']->format("Y-m-d")."'"));
        }

        return $queryBuilder;
    }

    public function findBySetRecord(int $record_id) {
        $queryBuilder = $this->createQueryBuilder('sequence');
        $queryBuilder->andWhere($queryBuilder->expr()->in('sequence.surfaceCover',$record_id));
        return $queryBuilder->getQuery()->getResult();
    }

    public function setDeleted(int $id) {
        $sequence = $this->find($id);
        $sequence->setDeleted(true);
        $this->getEntityManager()->persist($sequence);
        $this->getEntityManager()->flush();
    }
}
