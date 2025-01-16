<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
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
            'reps' => 'required|integer|min:0',
            'weight' => 'required|numeric|min:0',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        $workout = auth()->user()->workouts()->create([
            'workout_date' => now()
        ]);

        $workout->sets()->create([
            'exercise_id' => $exercise->id,
            ...$validated
        ]);

        return response()->json(['message' => 'Exercise completed successfully']);
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
