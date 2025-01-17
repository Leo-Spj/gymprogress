<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Workout;
use App\Models\WorkoutSet; // Añadir esta línea
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class ExerciseExecutionController extends Controller
{
    use AuthorizesRequests;

    public function start(Exercise $exercise)
    {
        $this->authorize('view', $exercise);
        return Inertia::render('Exercise/Start', [
            'exercise' => $exercise
        ]);
    }

    public function finish(Request $request, Exercise $exercise)
    {
        $this->authorize('view', $exercise);
        $validated = $request->validate([
            'weight' => 'required|numeric|min:0',
            'reps' => 'required|integer|min:1',
            'duration_seconds' => 'required|integer|min:0',
            'workout_id' => 'required|exists:workouts,id'
        ]);

        $workout = Workout::findOrFail($validated['workout_id']);
        
        // Verificar que el workout pertenece al usuario actual
        if ($workout->user_id !== auth()->id()) {
            abort(403);
        }

        $set = $workout->sets()->create([
            'exercise_id' => $exercise->id,
            'weight' => $validated['weight'],
            'reps' => $validated['reps'],
            'duration_seconds' => $validated['duration_seconds']
        ]);

        // Devolver el set creado con sus relaciones
        return response()->json($set->fresh());
    }

    public function rest(Exercise $exercise, Request $request)
    {
        $latestWorkout = Workout::where('user_id', auth()->id())
            ->orderBy('workout_date', 'desc')
            ->first();

        $latestSets = [];
        if ($latestWorkout) {
            $latestSets = WorkoutSet::where('workout_id', $latestWorkout->id)
                ->where('exercise_id', $exercise->id)
                ->orderBy('created_at', 'asc')
                ->get();
        }

        return Inertia::render('Exercise/Rest', [
            'exercise' => $exercise,
            'trendsData' => [
                'workout_date' => $latestWorkout?->workout_date,
                'sets' => $latestSets
            ],
            'routineId' => $request->query('routine_id') // Obtener el routine_id de la query
        ]);
    }
}
