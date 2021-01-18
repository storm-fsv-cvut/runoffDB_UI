<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 02.07.2019
 * Time: 23:23
 */

namespace App\Menu;

use App\Repository\CmsRepository;
use App\Repository\UserRepository;
use App\Security\EntityVoter;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Menu\FactoryInterface;
use Knp\Menu\Matcher\Matcher;
use Knp\Menu\Matcher\Voter\RouteVoter;
use Knp\Menu\Matcher\Voter\UriVoter;
use Psr\Container\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class MenuBuilder {
    /**
     * @var array
     */
    private $definitionEntities;
    private $factory;

    /**
     * @var Matcher
     */
    private $matcher;
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var RequestStack
     */
    private $requestStack;
    /**
     * @var CmsRepository
     */
    private $cmsRepository;
    /**
     * @var ContainerInterface
     */
    private $container;


    /**
     * MenuBuilder constructor.
     * @param FactoryInterface $factory
     * @param EntityManagerInterface $em
     * @param TranslatorInterface $translator
     */
    public function __construct(FactoryInterface $factory, EntityManagerInterface $em, TranslatorInterface $translator, RequestStack $requestStack, CmsRepository $cmsRepository, UserRepository $userRepository, ContainerInterface $container) {
        foreach ($em->getMetadataFactory()->getAllMetadata() as $entity) {
            if (in_array('App\Entity\DefinitionEntityInterface', $entity->getReflectionClass()->getInterfaceNames())) {
                $this->definitionEntities[$entity->name] = $translator->trans($entity->name);
            }
        }
        asort($this->definitionEntities);
        $this->factory = $factory;
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        $this->cmsRepository = $cmsRepository;
        $this->container = $container;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createAdminMenu(array $options) {
        $authChecker = $this->container->get('security.authorization_checker');


        $pages = $this->cmsRepository->findAllByType('content', $this->requestStack->getCurrentRequest()->getLocale());
        $this->matcher = new Matcher(new RouteVoter($this->requestStack));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget', 'tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        foreach ($pages as $page) {
            $menu->addChild($page['title'], ['route' => 'view_cms', 'routeParameters' => ['slug' => $page['slug']]]);
        }

        $sequences = $menu->addChild($this->translator->trans('sequences'), ['uri' => '#']);
        $sequences->setAttribute('class', 'treeview');
        $sequences->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $sequences->addChild($this->translator->trans('add'), ['route' => 'sequence']);
        }
        $sequences->addChild($this->translator->trans('list'), ['route' => 'sequences']);
        $sequences->addChild($this->translator->trans('overview table'), ['route' => 'sequencesOverview']);

        $soilSample = $menu->addChild($this->translator->trans('soilSamples'), ['uri' => '#']);
        $soilSample->setAttribute('class', 'treeview');
        $soilSample->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $soilSample->addChild($this->translator->trans('add'), ['route' => 'soilSample']);
        }
        $soilSample->addChild($this->translator->trans('list'), ['route' => 'soilSamples']);
        $soilSample->addChild($this->translator->trans('overview table'), ['route' => 'soilSamplesOverview']);

        $measurement = $menu->addChild($this->translator->trans('measurements'), ['uri' => '#']);
        $measurement->setAttribute('class', 'treeview');
        $measurement->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $measurement->addChild($this->translator->trans('add'), ['route' => 'measurement']);
        }
        $measurement->addChild($this->translator->trans('list'), ['route' => 'measurements']);

        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $cms = $menu->addChild($this->translator->trans('CMS'), ['uri' => '#']);
            $cms->setAttribute('class', 'treeview');
            $cms->setChildrenAttribute('class', 'treeview-menu');
            $cms->addChild($this->translator->trans('Tooltips'), ['route' => 'tooltips']);
            $cms->addChild($this->translator->trans('Content'), ['route' => 'contents']);
        }

        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $setup = $menu->addChild($this->translator->trans('Setup'), ['uri' => '#']);
            $setup->setAttribute('class', 'treeview');
            $setup->setChildrenAttribute('class', 'treeview-menu');
            foreach ($this->definitionEntities as $entity => $entity_name) {
                $item = $setup->addChild($entity_name, ['route' => 'definition_entities', 'routeParameters' => ['class' => $entity]]);
                if ($this->matcher->isCurrent($item)) {
                    $item->setCurrent(true);
                }
            }
        }

        if ($authChecker->isGranted(EntityVoter::ADMIN)) {
            $menu->addChild($this->translator->trans('users'), ['route' => 'users']);
        }
        return $menu;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createEditorMenu(array $options) {
        $pages = $this->cmsRepository->findAllByType('content', $this->requestStack->getCurrentRequest()->getLocale());
        $this->matcher = new Matcher(new UriVoter($_SERVER['REQUEST_URI']));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget', 'tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        foreach ($pages as $page) {
            $menu->addChild($page['title'], ['route' => 'view_cms', 'routeParameters' => ['slug' => $page['slug']]]);
        }
        $measurement = $menu->addChild($this->translator->trans('sequences'), ['uri' => '#']);
        $measurement->setAttribute('class', 'treeview');
        $measurement->setChildrenAttribute('class', 'treeview-menu');
        $measurement->addChild($this->translator->trans('add'), ['route' => 'sequence']);
        $measurement->addChild($this->translator->trans('list'), ['route' => 'sequences']);
        $setup = $menu->addChild($this->translator->trans('Setup'), ['uri' => '#']);
        $setup->setAttribute('class', 'treeview');
        $setup->setChildrenAttribute('class', 'treeview-menu');
        foreach ($this->definitionEntities as $entity => $entity_name) {
            $item = $setup->addChild($entity_name, ['route' => 'definition_entities', 'routeParameters' => ['class' => $entity]]);
            if ($this->matcher->isCurrent($item)) {
                $item->setCurrent(true);
            }
        }
        return $menu;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createGuestMenu(array $options) {
        $pages = $this->cmsRepository->findAllByType('content', $this->requestStack->getCurrentRequest()->getLocale());
        $this->matcher = new Matcher(new UriVoter($_SERVER['REQUEST_URI']));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget', 'tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        foreach ($pages as $page) {
            $menu->addChild($page['title'], ['route' => 'view_cms', 'routeParameters' => ['slug' => $page['slug']]]);
        }
        $menu->addChild($this->translator->trans('sequences'), ['route' => 'sequences']);
        return $menu;
    }
}
