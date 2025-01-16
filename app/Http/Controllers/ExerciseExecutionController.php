<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Workout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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

        $workout->sets()->create([
            'exercise_id' => $exercise->id,
            'weight' => $validated['weight'],
            'reps' => $validated['reps'],
            'duration_seconds' => $validated['duration_seconds']
        ]);

        return response()->json(['message' => 'Set registrado correctamente']);
    }

    public function rest(Exercise $exercise)
    {
        $this->authorize('view', $exercise);
        return Inertia::render('Exercise/Rest', [
            'exercise' => $exercise,
            'restConfig' => auth()->user()->restConfig
        ]);
    }
}
