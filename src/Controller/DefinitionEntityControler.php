<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Form\DefinitionEntityType;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Routing\Annotation\Route;

class DefinitionEntityControler extends AbstractController {

    /**
     * @Route("/settings", name="definition_entities")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    function list(EntityManagerInterface $em, Request $request, TranslatorInterface $translator, PaginatorInterface $paginator) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        $class = $request->get('class');
        $params['class'] = $class;
        $params['class_name'] = $translator->trans($class);
        $repo = $em->getRepository($class);
        $pagination = $paginator->paginate(
            $repo->createQueryBuilder('e'),
            $request->query->getInt('page', 1),
            20
        );

        $params['pagination'] = $pagination;
        return $this->render('definitionEntity/list.html.twig', $params);
    }

    /**
     * @Route("/setting/{id}", name="definition_entity")
     */
    function edit(Request $request, EntityManagerInterface $entityManager, TranslatorInterface $translator, ?int $id = null) {
        $this->denyAccessUnlessGranted(['ROLE_ADMIN','ROLE_EDITOR']);
        $class = $request->get('class');
        $dataClass = $id ? $entityManager->find($class, $id) : null;
        $form = $this->createForm(DefinitionEntityType::class, $dataClass, ['data_class' => $class]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $entity = $form->getData();
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();
            return $this->redirectToRoute('definition_entities', ['class' => $class]);
        }
        return $this->render('definitionEntity/edit.html.twig', ['form' => $form->createView(), 'class_name' => $translator->trans($class), 'class' => $class]);
    }
}
