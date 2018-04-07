<?php

namespace App\Application\Sonata\UserBundle\Entity;

use Sonata\UserBundle\Entity\BaseUser as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * myUser
 * @ORM\Table("fos_user_user")
 * @ORM\Entity()
 */
class User extends BaseUser
{
    public function __construct() {

        $this->todos = new \Doctrine\Common\Collections\ArrayCollection();
        parent::__construct();
    }

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * One User has Many todos.
     * @ORM\OneToMany(targetEntity="App\Entity\Todo", mappedBy="owner")
     */
    private $todos;


    /**
     * Get id.
     *
     * @return int $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getTodos()
    {
        return $this->todos;
    }

    /**
     * @param mixed $todolist
     */
    public function setTodos($todos)
    {
        if (count($todos) > 0) {
            foreach ($todos as $todo) {
                $this->addTodo($todo);
            }
        }

        return $this;
    }

    public function addTodo($todo)
    {
        $todo->setOwner($this);
        $this->todos->add($todo);
    }

    public function removeTodo($todo)
    {
        $this->todos->removeElement($todo);
        $todo->setOwner(null);
    }

}
