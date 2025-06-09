<?php

namespace App\Controller;

use App\Form\CmsType;
use App\Repository\CmsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CmsControler extends AbstractController
{
    public function __construct(
        private readonly CmsRepository $cmsRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly PaginatorInterface $paginator
    ) {}

    #[Route('/{_locale}/cms-list/{type}', name: 'cms-list')]
    public function listCms(Request $request, string $type): Response
    {
        $this->denyAccessUnlessGranted('edit');

        $qb = $this->cmsRepository->createQueryBuilder('cms');
        $qb->where('cms.type = :type')
           ->setParameter('type', $type);

        $pagination = $this->paginator->paginate(
            $qb,
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('cms/list.html.twig', [
            'type' => $type,
            'pagination' => $pagination,
        ]);
    }

    #[Route('/{_locale}/page/{slug}', name: 'page')]
    public function view(Request $request, string $slug): Response
    {
        $cms = $this->cmsRepository->findBySlug($slug, $request->getLocale());
        return $this->render('cms/view.html.twig', ['cms' => $cms]);
    }

    #[Route('/{_locale}/cms/{type}/{id}', name: 'cms', defaults: ['id' => null])]
    public function edit(Request $request, string $type, ?int $id = null): Response
    {
        $this->denyAccessUnlessGranted('edit');

        $entity = $id ? $this->cmsRepository->find($id) : null;
        $form = $this->createForm(CmsType::class, $entity);

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $cms = $form->getData();
            $cms->setType($type);
            $this->entityManager->persist($cms);
            $this->entityManager->flush();

            return $this->redirectToRoute('cms-list', ['type' => $type]);
        }

        return $this->render('cms/edit.html.twig', [
            'type' => $type,
            'form' => $form->createView(),
            'cms' => $entity,
        ]);
    }

    public function pagesMenu(Request $request): Response
    {
        $pages = $this->cmsRepository->findAllByType('content', $request->getLocale());
        return $this->render('menu/topMenu.html.twig', ['pages' => $pages]);
    }
}
