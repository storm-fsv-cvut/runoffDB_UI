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
use PhpParser\Node\Scalar\String_;
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
    function list(ContainerInterface $container, Request $request, TranslatorInterface $translator) {
        $class = $request->get('class');
        $renderer = $container->get('dtc_grid.renderer.factory')->create('datatables');
        $gridSource = $container->get('dtc_grid.manager.source')->get($class);
        $renderer->bind($gridSource);
        $params = $renderer->getParams();
        $params['class'] = $class;
        $params['class_name'] = $translator->trans($class);
        return $this->render('definitionEntity/list.html.twig',$params);
    }

    /**
     * @Route("/setting", name="definition_entity")
     * @param int|null $id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    function edit(Request $request, EntityManagerInterface $entityManager, TranslatorInterface $translator) {
        $class = $request->get('class');
        $id = $request->get('identifier');
        $dataClass = $id ? $entityManager->find($class,$id) : null;
        $form = $this->createForm(DefinitionEntityType::class,$dataClass,['data_class'=>$class]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $operationType = $form->getData();
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($operationType);
            $entityManager->flush();
            return $this->redirectToRoute('definition_entities',['class'=>$class]);
        }
        return $this->render('definitionEntity/edit.html.twig',['form'=>$form->createView(),'class_name'=>$translator->trans($class),'class'=>$class]);
    }
}
