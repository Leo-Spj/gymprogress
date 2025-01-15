<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index()
    {
        $workouts = auth()->user()->workouts()->with('sets.exercise')->get();
        return response()->json($workouts);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $today = now()->toDateString();

        $existingWorkout = $user->workouts()->whereDate('workout_date', $today)->first();

        if ($existingWorkout) {
            return response()->json($existingWorkout, 200);
        }

        $workout = $user->workouts()->create(['workout_date' => $today]);
        return response()->json($workout, 201);
    }

    public function show(Workout $workout)
    {
        $this->authorize('view', $workout);
        return response()->json($workout->load('sets.exercise'));
    }

    public function update(Request $request, Workout $workout)
    {
        $this->authorize('update', $workout);
        $validated = $request->validate([
            'workout_date' => 'required|date',
        ]);

        $workout->update($validated);
        return response()->json($workout);
    }

    public function destroy(Workout $workout)
    {
        $this->authorize('delete', $workout);
        $workout->delete();
        return response()->json(null, 204);
    }
}
