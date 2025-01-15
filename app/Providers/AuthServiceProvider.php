<?php

namespace App\Providers;

use App\Models\Routine;
use App\Policies\RoutinePolicy;
use App\Models\Exercise;
use App\Policies\ExercisePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Routine::class => RoutinePolicy::class,
        Exercise::class => ExercisePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        $this->registerPolicies();

        // ...existing code...
    }
}
