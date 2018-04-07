<?php

namespace App\Repository;

use App\Entity\Todo;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;

/**
 * TodoRepository
 */
class TodoRepository extends EntityRepository
{
    /**
     * Persists todo to database if it doesn't exist in database.
     *
     * @param Todo $todo
     * @return Todo
     */
    public function persistTodo(Todo $todo)
    {
        if ($todo->getId() !== null) {
            $todo = $this->_em->merge($todo);
        } else {
            $this->_em->persist($todo);
        }

        $this->_em->flush();

        return $todo;
    }

    /**
     * Deletes Todo.
     *
     * @param Todo $todo
     */
    public function deleteTodo(Todo $todo)
    {
        $this->_em->remove($todo);
        $this->_em->flush();
    }
}