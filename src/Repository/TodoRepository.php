<?php

namespace App\Repository;

use App\Entity\Todo;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Finder\Exception\AccessDeniedException;

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
     * Deletes Todo, after check if the user can do the action.
     * @param \App\Application\Sonata\UserBundle\Entity\User $user
     * @param Todo $todo
     */
    public function deleteTodo(Todo $todo, \App\Application\Sonata\UserBundle\Entity\User $user)
    {
        if (!is_null($user) && $todo->getOwner() == $user || $user->hasRole('ROLE_SUPER_ADMIN')) {
            $this->getEntityManager()->remove($todo);
            $this->getEntityManager()->flush();
        } else throw new AccessDeniedException('Impossibile rimuovere un todo di cui non si è proprietari');
    }

    /**
     * Gets all Todo owned by a specific user
     *
     * @param \App\Application\Sonata\UserBundle\Entity\User $user
     * @return mixed
     */
    public function getAllTodoByOwner($user)
    {
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();

        return $qb->select('t')
            ->from('App:Todo', 't')
            /* Todo, allow ROLE_SUPER_ADMIN to obtain all todoes (add the owner in the serialized json
             * then modify the excludes on baseUser (remove sensitive data like password hash etc)
             */
            ->where(
                $qb->expr()->eq('t.owner', $user->getId())
            )
            ->getQuery()->getResult();
    }

}