<?php
namespace App\Controller;


use App\Form\OperationTypeType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class OperationTypeController extends AbstractController {

    /**
     * @Route("/operation-types", name="operation_types")
     * @param ContainerInterface $container
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    function list(ContainerInterface $container, Request $request) {
        $renderer = $container->get('dtc_grid.renderer.factory')->create('datatables');
        $gridSource = $container->get('dtc_grid.manager.source')->get('App:OperationType');
        $renderer->bind($gridSource);
        $params = $renderer->getParams();
        return $this->render('operationType/list.html.twig',$params);
    }

    /**
     * @Route("/operation-type/{id}", name="operation_type")
     * @param int|null $id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    function edit(int $id = null, Request $request) {
        $form = $this->createForm(OperationTypeType::class);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $operationType = $form->getData();
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($operationType);
            $entityManager->flush();
            $this->redirectToRoute("operation_types");
        }
        return $this->render('operationType/edit.html.twig',['form'=>$form->createView()]);
    }
}
