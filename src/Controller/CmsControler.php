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

class CmsControler extends AbstractController {

    /**
     * @Route("/{_locale}/cms-list/{type}", name="cms-list")
     */
    function listCms(CmsRepository $cmsRepository, Request $request, PaginatorInterface $paginator, string $type) {
        $this->denyAccessUnlessGranted('edit');
        $qb = $cmsRepository->createQueryBuilder('cms');
        $qb->where("cms.type = '$type'");
        $pagination = $paginator->paginate(
            $qb,
            $request->query->getInt('page', 1),
            20
        );

        $params= [];
        $params['type'] = $type;
        $params['pagination'] = $pagination;
        return $this->render('cms/list.html.twig', $params);
    }

    /**
     * @Route("/{_locale}/page/{slug}", name="page")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    function view(Request $request, CmsRepository $cmsRepository, string $slug) {
        $cms = $cmsRepository->findBySlug($slug, $request->getLocale());
        return $this->render('cms/view.html.twig', ['cms'=>$cms]);
    }

    /**
     * @Route("/{_locale}/cms/{type}/{id}", name="cms")
     */
    function edit(CmsRepository $cmsRepository, Request $request, EntityManagerInterface $entityManager, ?int $id = null, string $type) {
        $this->denyAccessUnlessGranted('edit');
        if ($id!==null) {
            $entity = $cmsRepository->find($id);
            $form = $this->createForm(CmsType::class, $cmsRepository->find($id));
        } else {
            $form = $this->createForm(CmsType::class);
        }

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $cms = $form->getData();
            $cms->setType($type);
            $entityManager->persist($cms);
            $entityManager->flush();
            return $this->redirectToRoute('cms-list',['type'=>$type]);
        }

        $params= [];
        $params['type'] = $type;
        $params['form'] = $form->createView();
        $params['cms'] = $entity ?? null;
        return $this->render('cms/edit.html.twig', $params);
    }
    public function pagesMenu(CmsRepository $cmsRepository, Request $request): Response {
        $pages = $cmsRepository->findAllByType('content', $request->getLocale());
        return $this->render('menu/topMenu.html.twig', ['pages' => $pages]);
    }
}
