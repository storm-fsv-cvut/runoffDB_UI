<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 02.07.2019
 * Time: 23:23
 */

namespace App\Menu;

use Doctrine\ORM\EntityManagerInterface;
use Knp\Menu\FactoryInterface;
use Knp\Menu\Matcher\Matcher;
use Knp\Menu\Matcher\Voter\UriVoter;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Translation\Translator;
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
     * @param FactoryInterface $factory
     * @param Container $container
     */
    public function __construct(FactoryInterface $factory, EntityManagerInterface $em, TranslatorInterface $translator)
    {
        foreach ($em->getMetadataFactory()->getAllMetadata() as $entity) {
            if(in_array('App\Entity\DefinitionEntityInterface',$entity->getReflectionClass()->getInterfaceNames())) {
                $this->definitionEntities[]=$entity;
            }
        }
        $this->factory = $factory;
        $this->translator = $translator;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createMainMenu(array $options)
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
        foreach ($this->definitionEntities as $entity) {
            $item = $setup->addChild($entity->name, ['route' => 'definition_entities','routeParameters' => ['class'=>$entity->name]]);
            if($this->matcher->isCurrent($item)) {
                $item->setCurrent(true);
            }
        }
        return $menu;
    }
}
