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
     * @Route("/{_locale}/cms/contents", name="contents")
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    function listContent(CmsRepository $cmsRepository, Request $request, PaginatorInterface $paginator) {
        $this->denyAccessUnlessGranted('edit');

        $pagination = $paginator->paginate(
            $cmsRepository->getPaginatorQuery(['type' => 'content'], $request->get('order','id'), $request->get('direction','DESC')),
            $request->query->getInt('page', 1),
            20
        );

        $params= [];
        $params['type'] = 'content';
        $params['pagination'] = $pagination;
        return $this->render('cms/list.html.twig', $params);
    }


    /**
     * @Route("/{_locale}/cms/tooltips", name="tooltips")
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    function listTooltips(CmsRepository $cmsRepository, Request $request, PaginatorInterface $paginator) {
        $this->denyAccessUnlessGranted('edit');
        $qb = $cmsRepository->createQueryBuilder('cms');
        $qb->where("cms.type = 'tooltip'");
        $pagination = $paginator->paginate(
            $qb,
            $request->query->getInt('page', 1),
            20
        );

        $params= [];
        $params['pagination'] = $pagination;
        $params['type'] = 'tooltip';
        return $this->render('cms/list.html.twig', $params);
    }

    /**
     * @Route("/{_locale}/page/{slug}", name="view_cms")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    function view(Request $request, CmsRepository $cmsRepository, string $slug) {
        $cms = $cmsRepository->findBySlug($slug, $request->getLocale());
        return $this->render('cms/view.html.twig', ['cms'=>$cms]);
    }

    /**
     * @Route("/{_locale}/cms/edit/{type}/{id}", name="edit_cms")
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    function edit(CmsRepository $cmsRepository, Request $request, EntityManagerInterface $entityManager, string $type, ?int $id = null) {
        $this->denyAccessUnlessGranted('edit');

        if ($id!==null) {
            $entity = $cmsRepository->find($id);
            $form = $this->createForm(CmsType::class, $cmsRepository->find($id));
        } else {
            $form = $this->createForm(CmsType::class);
        }

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $cms = $form->getData();
            $cms->setType($type);
            $entityManager->persist($cms);
            $entityManager->flush();

            return $this->redirectToRoute($type.'s');
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
