<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExercisePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Exercise $exercise)
    {
        return $user->id === $exercise->user_id;
    }

    public function update(User $user, Exercise $exercise)
    {
        return $user->id === $exercise->user_id;
    }

    public function delete(User $user, Exercise $exercise)
    {
        return $user->id === $exercise->user_id;
    }
}
