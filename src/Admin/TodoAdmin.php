<?php

namespace App\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Show\ShowMapper;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Sonata\CoreBundle\Form\Type\DateTimePickerType;

class TodoAdmin extends AbstractAdmin
{
    private $tokenStorage;

    public function __construct(string $code, string $class, string $baseControllerName)
    {
        parent::__construct($code, $class, $baseControllerName);
    }

    public function setToken($security){
        $this->tokenStorage = $security->getToken();
    }

    //protected $baseRouteName = 'base_route_name';
    //protected $baseRoutePattern = 'base/route';

    /*protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'value');*/

    public function createQuery($context = 'list')
    {
        $query = parent::createQuery($context);

        if (!$this->tokenStorage->getUser()->hasRole('ROLE_SUPER_ADMIN')) {
            $query->andWhere(
                $query->expr()->eq($query->getRootAliases()[0] . '.owner', ':owner')
            )
                ->setParameter('owner', $this->tokenStorage->getUser());
        }
        return $query;
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        //$collection->add('route', $this->getRouterIdParameter().'/route');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add("title")
            ->add('completed');
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('title')
            ->add('dueDate',DateTimePickerType::class, array(
                'dp_side_by_side'       => true,
                'dp_use_current'        => false,
                'dp_use_seconds'        => false,
                'dp_collapse'           => true,
                'dp_calendar_weeks'     => false,
                'dp_view_mode'          => 'days',
                'dp_min_view_mode'      => 'days'
            ))
            ->add('completed')
            ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add("title")
            ->add('completed')
            ->add('insertDate')
            ->add('modifyDate');
        if ($this->tokenStorage->getUser()->hasRole('ROLE_SUPER_ADMIN')){
            $listMapper
                ->add("owner");
        }
        $listMapper
            ->add('_action', null, [
                'actions' => [
                    'show' => [],
                    'delete' => [],

                    'edit'=>[]
                ]
            ]);
    }

    protected function configureShowFields(ShowMapper $showMapper)
    {
        if ($this->getSubject()->getOwner() == $this->tokenStorage->getUser())
        $showMapper
            ->add("title")
            ->add('completed');
    }

    /**
     * {@inheritdoc}
     */
    public function prePersist($object)
    {
        $object->setOwner($this->tokenStorage->getUser());
    }

    public function delete($object)
    {
        if ($object->getOwner() == $this->tokenStorage->getUser()) {
            $this->preRemove($object);
            foreach ($this->extensions as $extension) {
                $extension->preRemove($this, $object);
            }

            $this->getSecurityHandler()->deleteObjectSecurity($this, $object);
            $this->getModelManager()->delete($object);

            $this->postRemove($object);
            foreach ($this->extensions as $extension) {
                $extension->postRemove($this, $object);
            }
        } else throw new AccessDeniedException('Impossibile cancellare un todo che non è dell\' utente loggato!');
    }


}
