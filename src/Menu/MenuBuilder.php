<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 02.07.2019
 * Time: 23:23
 */

namespace App\Menu;

use App\Repository\CmsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Menu\FactoryInterface;
use Knp\Menu\Matcher\Matcher;
use Knp\Menu\Matcher\Voter\RouteVoter;
use Knp\Menu\Matcher\Voter\UriVoter;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

class MenuBuilder
{
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
     * MenuBuilder constructor.
     * @param FactoryInterface $factory
     * @param EntityManagerInterface $em
     * @param TranslatorInterface $translator
     */
    public function __construct(FactoryInterface $factory, EntityManagerInterface $em, TranslatorInterface $translator, RequestStack $requestStack, CmsRepository $cmsRepository)
    {
        foreach ($em->getMetadataFactory()->getAllMetadata() as $entity) {
            if(in_array('App\Entity\DefinitionEntityInterface',$entity->getReflectionClass()->getInterfaceNames())) {
                $this->definitionEntities[$entity->name]=$translator->trans($entity->name);
            }
        }
        asort($this->definitionEntities);
        $this->factory = $factory;
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        $this->cmsRepository = $cmsRepository;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createAdminMenu(array $options)
    {
        $pages = $this->cmsRepository->findAllByType('content',$this->requestStack->getCurrentRequest()->getLocale());
        $this->matcher = new Matcher(new RouteVoter($this->requestStack));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class','sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget','tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        foreach ($pages as $page) {
            $menu->addChild($page['title'],['route'=>'view_cms','routeParameters'=>['slug'=>$page['slug']]]);
        }
        $sequences = $menu->addChild($this->translator->trans('sequences'), ['uri' => '#']);
        $sequences->setAttribute('class','treeview');
        $sequences->setChildrenAttribute('class','treeview-menu');
        $sequences->addChild($this->translator->trans('add'), ['route' => 'sequence']);
        $sequences->addChild($this->translator->trans('list'), ['route' => 'sequences']);
        $sequences->addChild($this->translator->trans('overview table'), ['route' => 'sequencesOverview']);

        $soilSample = $menu->addChild($this->translator->trans('soilSamples'), ['uri' => '#']);
        $soilSample->setAttribute('class','treeview');
        $soilSample->setChildrenAttribute('class','treeview-menu');
        $soilSample->addChild($this->translator->trans('add'), ['route' => 'soilSample']);
        $soilSample->addChild($this->translator->trans('list'), ['route' => 'soilSamples']);
        $soilSample->addChild($this->translator->trans('overview table'), ['route' => 'soilSamplesOverview']);

        $measurement = $menu->addChild($this->translator->trans('measurements'), ['uri' => '#']);
        $measurement->setAttribute('class','treeview');
        $measurement->setChildrenAttribute('class','treeview-menu');
        $measurement->addChild($this->translator->trans('add'), ['route' => 'measurement']);
        $measurement->addChild($this->translator->trans('list'), ['route' => 'measurements']);

        $cms = $menu->addChild($this->translator->trans('CMS'), ['uri' => '#']);
        $cms->setAttribute('class','treeview');
        $cms->setChildrenAttribute('class','treeview-menu');
        $cms->addChild($this->translator->trans('Tooltips'), ['route' => 'tooltips']);
        $cms->addChild($this->translator->trans('Content'), ['route' => 'contents']);

        $setup = $menu->addChild($this->translator->trans('Setup'), ['uri' => '#']);
        $setup->setAttribute('class','treeview');
        $setup->setChildrenAttribute('class','treeview-menu');
        foreach ($this->definitionEntities as $entity=>$entity_name) {
            $item = $setup->addChild($entity_name, ['route' => 'definition_entities','routeParameters' => ['class'=>$entity]]);
            if($this->matcher->isCurrent($item)) {
                $item->setCurrent(true);
            }
        }
        $menu->addChild($this->translator->trans('users'), ['route' => 'users']);
        return $menu;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createEditorMenu(array $options)
    {
        $this->matcher = new Matcher(new UriVoter($_SERVER['REQUEST_URI']));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class','sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget','tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        $measurement = $menu->addChild($this->translator->trans('sequences'), ['uri' => '#']);
        $measurement->setAttribute('class','treeview');
        $measurement->setChildrenAttribute('class','treeview-menu');
        $measurement->addChild($this->translator->trans('add'), ['route' => 'sequence']);
        $measurement->addChild($this->translator->trans('list'), ['route' => 'sequences']);
        $setup = $menu->addChild($this->translator->trans('Setup'), ['uri' => '#']);
        $setup->setAttribute('class','treeview');
        $setup->setChildrenAttribute('class','treeview-menu');
        foreach ($this->definitionEntities as $entity=>$entity_name) {
            $item = $setup->addChild($entity_name, ['route' => 'definition_entities','routeParameters' => ['class'=>$entity]]);
            if($this->matcher->isCurrent($item)) {
                $item->setCurrent(true);
            }
        }
        return $menu;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createGuestMenu(array $options)
    {
        $this->matcher = new Matcher(new UriVoter($_SERVER['REQUEST_URI']));
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class','sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget','tree');
        $menu->addChild($this->translator->trans('Home'), ['route' => 'homepage']);
        $menu->addChild($this->translator->trans('sequences'), ['route' => 'sequences']);
        return $menu;
    }
}
