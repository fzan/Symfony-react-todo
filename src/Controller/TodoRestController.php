<?php

namespace App\Controller;

use App\Entity\Todo;
use App\Repository\TodoRepository;

use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Swagger\Annotations as SWG;
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations\View as FOSView;
use FOS\RestBundle\Util\Codes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;

class TodoRestController extends FOSRestController implements ClassResourceInterface
{
    private $tokenStorage;

    public function __construct(\Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage )
    {
        $this->tokenStorage = $tokenStorage;

    }

    /**
     * It gets all the todos related to the currently authenticated owner
     *
     * @Route(name="get_todo", path="/api/todo/get")
     * @Method("GET")
     * @FOSView(serializerEnableMaxDepthChecks=true)
     * @return FOSView
     */
    public function cgetAction()
    {
        $repository = $this->getDoctrine()->getRepository('App:Todo');

        return $repository->getAllTodoByOwner($this->tokenStorage->getToken()->getUser());
    }

    /**
     * Delete a todo
     *
     * @Route(name="delete_todo", path="/api/todo/delete/{todo}")
     * @Method("DELETE")
     * @FOSView(serializerEnableMaxDepthChecks=true)
     * @return FOSView
     */
    public function deleteAction(Request $request, Todo $todo)
    {
        $repository = $this->getDoctrine()->getRepository('App:Todo');

        return $repository->deleteTodo($todo, $this->tokenStorage->getToken()->getUser());

        /*try {
            $em = $this->getDoctrine()->getManager();
            $em->remove($todo);
            $em->flush();

            return null;
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }*/
    }

}