<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\RoutineController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\WorkoutSetController; // Añadir esta línea
use App\Http\Controllers\RestConfigController;
use App\Http\Controllers\ExerciseExecutionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('routines.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas para gestión de rutinas
    Route::get('/rutinas', [RoutineController::class, 'index'])->name('routines.index');
    Route::get('/rutinas/create', [RoutineController::class, 'create'])->name('routines.create');
    Route::post('/rutinas', [RoutineController::class, 'store'])->name('routines.store');
    Route::get('/rutinas/{routine}', [RoutineController::class, 'show'])->name('routines.show');
    Route::get('/rutinas/{routine}/edit', [RoutineController::class, 'edit'])->name('routines.edit');
    Route::put('/rutinas/{routine}', [RoutineController::class, 'update'])->name('routines.update');
    Route::delete('/rutinas/{routine}', [RoutineController::class, 'destroy'])->name('routines.destroy');
    Route::get('/rutinas/{routine}/add-exercise', [RoutineController::class, 'showAddExerciseForm'])->name('routines.showAddExerciseForm');
    Route::post('/rutinas/{routine}/add-exercise', [RoutineController::class, 'addExercise'])->name('routines.addExercise');
    Route::delete('/rutinas/{routine}/remove-exercise/{exercise}', [RoutineController::class, 'removeExercise'])->name('routines.removeExercise');
    Route::put('/rutinas/{routine}/exercise-order', [RoutineController::class, 'updateExercisesOrder'])->name('routines.updateExercisesOrder');

    // Rutas para ejercicios
    Route::get('/ejercicios', [ExerciseController::class, 'index'])->name('exercises.index');
    Route::get('/ejercicios/create', [ExerciseController::class, 'create'])->name('exercises.create');
    Route::post('/ejercicios', [ExerciseController::class, 'store'])->name('exercises.store');
    Route::get('/ejercicios/{exercise}', [ExerciseController::class, 'show'])->name('exercises.show');
    Route::get('/ejercicios/{exercise}/edit', [ExerciseController::class, 'edit'])->name('exercises.edit');
    Route::put('/ejercicios/{exercise}', [ExerciseController::class, 'update'])->name('exercises.update');
    Route::delete('/ejercicios/{exercise}', [ExerciseController::class, 'destroy'])->name('exercises.destroy');
    Route::get('/exercises/{exercise}/latest-sets', [ExerciseController::class, 'getLatestWorkoutSets'])
        ->name('exercise.latest-sets');

    // Rutas para seguimiento de ejercicios
    Route::get('/seguimiento', [WorkoutController::class, 'index'])->name('tracking.index');
    Route::post('/seguimiento', [WorkoutController::class, 'store'])->name('tracking.store');
    Route::post('/workouts', [WorkoutController::class, 'store'])->name('workouts.store'); // Añadir esta línea

    // Modificar las rutas de workouts
    Route::post('/workouts/get-or-create', [WorkoutController::class, 'getOrCreate'])->name('workouts.getOrCreate');

    // Agregar nueva ruta para tendencias
    Route::get('/tendencias/{exercise}', [WorkoutController::class, 'trends'])->name('trends.show');

    // // Rutas para configuraciones de descanso
    // Route::get('/configuracion/descanso', [RestConfigController::class, 'edit'])->name('rest.edit');
    // Route::put('/configuracion/descanso', [RestConfigController::class, 'update'])->name('rest.update');

    // Rutas para la ejecución del ejercicio
    Route::get('/ejercicio/{exercise}/iniciar', [ExerciseExecutionController::class, 'start'])->name('exercise.start');
    Route::post('/ejercicio/{exercise}/finalizar', [ExerciseExecutionController::class, 'finish'])->name('exercise.finish');
    Route::get('/ejercicio/{exercise}/descanso', [ExerciseExecutionController::class, 'rest'])->name('exercise.rest');

    // Rutas para workout sets
    Route::controller(WorkoutSetController::class)->group(function () {
        Route::put('/workout-sets/{set}', 'update')->name('workout-sets.update');
        Route::delete('/workout-sets/{set}', 'destroy')->name('workout-sets.destroy');
    });
});

require __DIR__.'/auth.php';
