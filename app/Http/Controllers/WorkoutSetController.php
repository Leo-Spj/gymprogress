<?php

namespace App\Http\Controllers;

use App\Models\WorkoutSet;
use App\Models\Workout;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkoutSetController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Workout $workout)
    {
        $this->authorize('update', $workout);
        
        $validated = $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
            'reps' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'duration_seconds' => 'integer|min:0',
        ]);

        $set = $workout->sets()->create($validated);
        return response()->json($set, 201);
    }

    public function update(Request $request, WorkoutSet $set)
    {
        $this->authorize('update', $set->workout);
        
        $validated = $request->validate([
            'reps' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'duration_seconds' => 'integer|min:0',
        ]);

        $set->update($validated);
        return response()->json($set);
    }

    public function destroy(WorkoutSet $set)
    {
        $this->authorize('delete', $set->workout);
        $set->delete();
        return response()->json(null, 204);
    }
}
