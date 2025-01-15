<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Routine;
use Illuminate\Auth\Access\HandlesAuthorization;

class RoutinePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the routine.
     */
    public function view(User $user, Routine $routine)
    {
        return $user->id === $routine->user_id;
    }

    /**
     * Determine whether the user can update the routine.
     */
    public function update(User $user, Routine $routine)
    {
        return $user->id === $routine->user_id;
    }

    /**
     * Determine whether the user can delete the routine.
     */
    public function delete(User $user, Routine $routine)
    {
        return $user->id === $routine->user_id;
    }
}
