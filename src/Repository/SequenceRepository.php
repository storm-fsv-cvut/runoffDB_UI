<?php

namespace App\Repository;

use Exception;;
use App\Entity\Sequence;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

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

    public function __construct(ManagerRegistry $registry, PlotRepository $plotRepository)
    {
        parent::__construct($registry, Sequence::class);
        $this->plotRepository = $plotRepository;
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('sequence');
        $queryBuilder->select('sequence');
        $queryBuilder->leftJoin('sequence.runGroups', 'rg', 'WITH', 'rg.sequence = sequence.id');
        $queryBuilder->leftJoin('sequence.simulator', 'si', 'WITH', 'sequence.simulator = si.id');
        $queryBuilder->leftJoin('si.organization', 'org', 'WITH', 'si.organization = org.id');
        $queryBuilder->leftJoin('rg.runs', 'r', 'WITH', 'r.runGroup = rg.id');
        $queryBuilder->leftJoin('r.plot', 'p', 'WITH', 'r.plot = p.id');
        $queryBuilder->leftJoin('p.locality', 'l', 'WITH', 'p.locality = l.id');
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
        if (isset($filter['locality']) && $filter['locality']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('p.locality',$filter['locality']->getId()));
        }
        if (isset($filter['organization']) && $filter['organization']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('si.organization',$filter['organization']->getId()));
        }
        if (isset($filter['dateFrom']) && $filter['dateFrom']) {
            $queryBuilder->andWhere($queryBuilder->expr()->gte('sequence.date',"'".$filter['dateFrom']->format("Y-m-d")."'"));
        }
        if (isset($filter['dateTo']) && $filter['dateTo']) {
            $queryBuilder->andWhere($queryBuilder->expr()->lte('sequence.date',"'".$filter['dateTo']->format("Y-m-d")."'"));
        }
        if (isset($filter['simulator']) && $filter['simulator']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('sequence.simulator',$filter['simulator']->getId()));
        }
        return $queryBuilder;
    }

    public function setDeleted(int $id): void {
        $sequence = $this->find($id);
        if ($sequence===null) {
            throw new Exception("Sequence doesnt exists");
        }
        $sequence->setDeleted(true);
        $this->getEntityManager()->persist($sequence);
        $this->getEntityManager()->flush();
    }
}
