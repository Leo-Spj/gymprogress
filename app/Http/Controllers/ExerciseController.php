<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index()
    {
        $exercises = auth()->user()->exercises()->get();
        return response()->json($exercises);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'image_url' => 'nullable|url|max:2083',
        ]);

        $exercise = auth()->user()->exercises()->create($validated);
        return response()->json($exercise, 201);
    }

    public function show(Exercise $exercise)
    {
        $this->authorize('view', $exercise);
        return response()->json($exercise);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $this->authorize('update', $exercise);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'image_url' => 'nullable|url|max:2083',
        ]);

        $exercise->update($validated);
        return response()->json($exercise);
    }

    public function destroy(Exercise $exercise)
    {
        $this->authorize('delete', $exercise);
        $exercise->delete();
        return response()->json(null, 204);
    }
}
