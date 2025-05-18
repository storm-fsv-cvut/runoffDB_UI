<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 02.07.2019
 * Time: 23:23
 */

namespace App\Menu;

use App\Repository\CmsRepository;
use App\Security\EntityVoter;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Menu\FactoryInterface;
use Knp\Menu\Matcher\Matcher;
use Knp\Menu\Matcher\Voter\RegexVoter;
use Psr\Container\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class MenuBuilder
{
    /**
     * @var array
     */
    private $definitionEntities;
    private FactoryInterface $factory;
    private Matcher $matcher;
    private TranslatorInterface $translator;
    private RequestStack $requestStack;


    /**
     * MenuBuilder constructor.
     * @param FactoryInterface $factory
     * @param EntityManagerInterface $em
     * @param TranslatorInterface $translator
     */
    public function __construct(
        FactoryInterface $factory,
        EntityManagerInterface $em,
        TranslatorInterface $translator,
        RequestStack $requestStack,
        CmsRepository $cmsRepository,
        ContainerInterface $container,
        AuthorizationCheckerInterface $authChecker
    ) {
        foreach ($em->getMetadataFactory()->getAllMetadata() as $entity) {
            if (in_array(
                'App\Entity\DefinitionEntityInterface',
                $entity->getReflectionClass()->getInterfaceNames(),
                true
            )) {
                $this->definitionEntities[$entity->name] = $translator->trans($entity->name);
            }
        }
        asort($this->definitionEntities);
        $this->factory = $factory;
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        $this->authChecker = $authChecker;
    }

    /**
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createAdminMenu(array $options)
    {
        $pattern = "/".substr($this->requestStack->getCurrentRequest()->attributes->get('_route'),0,3)."/";
        $this->matcher = new Matcher([new RegexVoter($pattern)]);
        $authChecker = $this->authChecker;
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'sidebar-menu tree');
        $menu->setChildrenAttribute('data-widget', 'tree');

        $sequences = $menu->addChild($this->translator->trans('sequences'), ['uri' => '#']);
        $sequences->setAttribute('class', 'treeview');
        $sequences->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $add = $sequences->addChild($this->translator->trans('add'), ['route' => 'sequence']);
            if ($this->matcher->isCurrent($add)) {
                $sequences->setCurrent(true);
            }
        }
        $list = $sequences->addChild($this->translator->trans('list'), ['route' => 'sequences']);
        $overview = $sequences->addChild($this->translator->trans('overview table'), ['route' => 'sequencesOverview']);
        if ($this->matcher->isCurrent($list) || $this->matcher->isCurrent($overview)) {
            $sequences->setCurrent(true);
        }

        $soilSample = $menu->addChild($this->translator->trans('soilSamples'), ['uri' => '#']);
        $soilSample->setAttribute('class', 'treeview');
        $soilSample->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $add = $soilSample->addChild($this->translator->trans('add'), ['route' => 'soilSample']);
            if ($this->matcher->isCurrent($add)) {
                $soilSample->setCurrent(true);
            }
        }
        $list = $soilSample->addChild($this->translator->trans('list'), ['route' => 'soilSamples']);

        if ($this->matcher->isCurrent($list)) {
            $soilSample->setCurrent(true);
        }

        $measurement = $menu->addChild($this->translator->trans('measurements'), ['uri' => '#']);
        $measurement->setAttribute('class', 'treeview');
        $measurement->setChildrenAttribute('class', 'treeview-menu');
        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $add = $measurement->addChild($this->translator->trans('add'), ['route' => 'measurement']);
            if ($this->matcher->isCurrent($add)) {
                $measurement->setCurrent(true);
            }
        }
        $list = $measurement->addChild($this->translator->trans('list'), ['route' => 'measurements']);
        if ($this->matcher->isCurrent($list)) {
            $measurement->setCurrent(true);
        }

        if ($authChecker->isGranted(EntityVoter::CMS)) {
            $cms = $menu->addChild($this->translator->trans('CMS'), ['uri' => '#']);
            $cms->setAttribute('class', 'treeview');
            $cms->setChildrenAttribute('class', 'treeview-menu');
            $tooltips = $cms->addChild($this->translator->trans('Tooltips'), ['route' => 'cms-list', 'routeParameters'=>['type'=>'tooltip']]);
            $contents = $cms->addChild($this->translator->trans('Content'), ['route' => 'cms-list', 'routeParameters'=>['type'=>'content']]);
            if ($this->matcher->isCurrent($tooltips) || $this->matcher->isCurrent($contents)) {
                $cms->setCurrent(true);
            }
        }

        if ($authChecker->isGranted(EntityVoter::EDIT)) {
            $setup = $menu->addChild($this->translator->trans('Setup'), ['uri' => '#']);
            $setup->setAttribute('class', 'treeview');
            $setup->setChildrenAttribute('class', 'treeview-menu');
            foreach ($this->definitionEntities as $entity => $entity_name) {
                $item = $setup->addChild(
                    $entity_name,
                    ['route' => 'settings', 'routeParameters' => ['class' => $entity]]
                );
                if ($this->matcher->isCurrent($item)) {
                    $setup->setCurrent(true);
                }
            }
        }

        if ($authChecker->isGranted(EntityVoter::ADMIN)) {
            $users = $menu->addChild($this->translator->trans('users'), ['route' => 'users']);
            if ($this->matcher->isCurrent($users)) {
                $users->setCurrent(true);
            }
        }
        return $menu;
    }
}

