<?php

declare(strict_types=1);

namespace App\Menu;

use App\Services\DefinitionEntityService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MenuController extends AbstractController
{
    public function __construct(
        private readonly DefinitionEntityService $definitionEntityService,
    ) {
    }

    public function mainMenu(Request $request): Response
    {
        $entitiesArray = $this->definitionEntityService->getDefinitionEntitiesArray();
        $menu = $request->get('menu');
        $submenu = $request->get('submenu');

        return $this->render('menu/mainMenu.html.twig', [
            'entities' => $entitiesArray,
            'menu' => $menu,
            'submenu' => $submenu,
        ]);
    }
}
