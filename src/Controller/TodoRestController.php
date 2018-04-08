<?php

namespace App\Controller;

use App\Entity\Todo as Todo;
use App\Repository\TodoRepository;

use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use PHPUnit\Runner\Exception;
use Swagger\Annotations as SWG;
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations\View as FOSView;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;

class TodoRestController extends FOSRestController implements ClassResourceInterface
{
    private $tokenStorage;

    public function __construct(\Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;

    }

    /**
     * Create a new todo
     *
     * @Route(name="add_todo", path="/api/todo/add")
     * @SWG\Parameter(
     *          name="userCredentials",
     *          in="body",
     *          type="json",
     *          description="User data",
     *          @SWG\Schema(
     *              type="object",
     *              @SWG\Property(property="title", type="string"),
     *              @SWG\Property(property="startDate", type="string"),
     *              @SWG\Property(property="endDate", type="string")
     *          )
     *     ),
     * @SWG\Response(
     *         response=200,
     *         description="Return aknowledge or error"
     *     )
     * @Method("POST")
     * @FOSView(serializerEnableMaxDepthChecks=true)
     * @return FOSView
     */
    public function postAction(Request $request)
    {
        $params = json_decode($request->getContent(), true);
        $startDate = date_create_from_format('Y-m-d H:i', $params['startDate']);
        $endDate = date_create_from_format('Y-m-d H:i', $params['endDate']);
        $title = $params['title'];

        if (is_bool($startDate)||is_bool($endDate)){
            throw new \Exception('Formato data non valido');
        }

        //fix for all day long todos
        if ($startDate == $endDate){
            $endDate->add(new \DateInterval('PT23H30M59S'));
        }
        /* Maybe move to repository? :) */
        $todo = new Todo();
        $todo->setInsDate($startDate);
        $todo->setDueDate($endDate);
        $todo->setTitle($title);
        $todo->setCompleted(false);

        $repository = $this->getDoctrine()->getRepository('App:Todo');

        return $repository->addTodo($todo, $this->tokenStorage->getToken()->getUser());

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

    }

    /**
     * Toggle a todo
     *
     * @Route(name="toggle_todo", path="/api/todo/toggle/{todo}")
     * @Method("PATCH")
     * @FOSView(serializerEnableMaxDepthChecks=true)
     * @return FOSView
     */
    public function toggleAction(Request $request, Todo $todo)
    {
        $repository = $this->getDoctrine()->getRepository('App:Todo');

        return $repository->toggleTodo($todo, $this->tokenStorage->getToken()->getUser());

    }


}