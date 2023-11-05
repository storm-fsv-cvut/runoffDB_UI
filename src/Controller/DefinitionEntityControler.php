<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Form\AgrotechnologyType;
use App\Form\CropFilterType;
use App\Form\DefinitionEntityType;
use App\Form\PlotFilterType;
use App\Form\ProjectType;
use App\Repository\CropRepository;
use App\Repository\PlotRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Routing\Annotation\Route;

class DefinitionEntityControler extends AbstractController
{

    /**
     * @Route("/{_locale}/settings/{class}", name="settings")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function list(
        EntityManagerInterface $em,
        Request                $request,
        TranslatorInterface    $translator,
        PaginatorInterface     $paginator,
        CropRepository         $cropRepository,
        PlotRepository         $plotRepository,
        string $class
    ): Response {
        $this->denyAccessUnlessGranted('edit');
        //$class = $request->get('class');
        $params = [];
        $params['class'] = $class;
        $params['class_name'] = $translator->trans($class);

        if ($class == "App\Entity\Crop") {
            $filter = $this->createForm(
                CropFilterType::class,
                null,
                ['method' => 'get', 'action' => $this->generateUrl('settings', ['class' => $class])]
            );

            $filter->handleRequest($request);

            $pagination = $paginator->paginate(
                $cropRepository->getPaginatorQuery(
                    $filter->getData(),
                    $request->get('order', 'nameCZ'),
                    $request->get('direction', 'DESC')
                ),
                $request->query->getInt('page', 1),
                20
            );

            $params['filter'] = $filter->createView();
            $params['pagination'] = $pagination;

            $params['sort_columns']['name'] = $translator->getLocale() == 'en' ? 'crop.nameEN' : 'crop.nameCZ';

            return $this->render('crop/list.html.twig', $params);
        } else if ($class == "App\Entity\Plot") {
            $filter = $this->createForm(
                PlotFilterType::class,
                null,
                ['method' => 'get', 'action' => $this->generateUrl('settings', ['class' => $class])]
            );

            $filter->handleRequest($request);

            $pagination = $paginator->paginate(
                $plotRepository->getPaginatorQuery(
                    $filter->getData(),
                    $request->get('order', 'nameCZ'),
                    $request->get('direction', 'DESC')
                ),
                $request->query->getInt('page', 1),
                20
            );


            $params['pagination'] = $pagination;
            $params['filter'] = $filter->createView();
            $params['sort_columns']['crop'] = $translator->getLocale() == 'en' ? 'c.nameEN' : 'c.nameCZ';
            $params['sort_columns']['protectionMeasure'] = $translator->getLocale() == 'en' ? 'pm.nameEN' : 'pm.nameCZ';

            return $this->render('plot/list.html.twig', $params);
        } else {
            $repo = $em->getRepository($class);
            $builder = $repo->createQueryBuilder('e');

            $pagination = $paginator->paginate(
                $builder,
                $request->query->getInt('page', 1),
                20
            );

            $params['pagination'] = $pagination;

            return $this->render('definitionEntity/list.html.twig', $params);
        }
    }

    /**
     * @Route("/{_locale}/setting/{id}", name="setting")
     */
    public function edit(
        Request                $request,
        EntityManagerInterface $entityManager,
        TranslatorInterface    $translator,
        ?int                   $id = null
    ): Response {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $dataClass = $id !== null ? $entityManager->find($class, $id) : null;
        if ($class == "App\Entity\Agrotechnology") {
            $form = $this->createForm(AgrotechnologyType::class, $dataClass, ['data_class' => $class]);
            $form->handleRequest($request);
        } else if ($class == "App\Entity\Project") {
            $form = $this->createForm(ProjectType::class, $dataClass, ['data_class' => $class]);
            $form->handleRequest($request);
        } else {
            $form = $this->createForm(DefinitionEntityType::class, $dataClass, ['data_class' => $class]);
            $form->handleRequest($request);
        }

        if ($form->isSubmitted() && $form->isValid()) {
            $entity = $form->getData();
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();
            return $this->redirectToRoute('settings', ['class' => $class]);
        }
        return $this->render(
            'definitionEntity/edit.html.twig',
            ['form' => $form->createView(), 'class_name' => $translator->trans(
                $class
            ), 'class' => $class, 'id'=>$id]
        );
    }

    /**
     * @Route("/{_locale}/settings/delete/{id}", name="delete_setting")
     */
    public function delete(
        Request                $request,
        EntityManagerInterface $entityManager,
        TranslatorInterface    $translator,
        ?int                   $id = null
    ) {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $dataClass = $id !== null ? $entityManager->find($class, $id) : null;
        $entityManager->remove($dataClass);
        $entityManager->flush();
        return $this->redirectToRoute('settings', ['class' => $class]);
    }
}
