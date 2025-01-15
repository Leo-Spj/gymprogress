<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $exercises = auth()->user()->exercises()->get();
        return Inertia::render('Exercises/Index', [
            'exercises' => $exercises
        ]);
    }

    public function create()
    {
        return Inertia::render('Exercises/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'image_url' => 'nullable|url|max:2083',
        ]);

        $validated['user_id'] = auth()->id();
        $exercise = Exercise::create($validated);
        
        return redirect()->route('exercises.index');
    }

    public function show(Exercise $exercise)
    {
        $this->authorize('view', $exercise);
        return Inertia::render('Exercises/Show', [
            'exercise' => $exercise
        ]);
    }

    public function edit(Exercise $exercise)
    {
        $this->authorize('update', $exercise);
        return Inertia::render('Exercises/Edit', [
            'exercise' => $exercise
        ]);
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
        return redirect()->route('exercises.index');
    }

    public function destroy(Exercise $exercise)
    {
        $this->authorize('delete', $exercise);
        $exercise->delete();
        return response()->json(null, 204);
    }
}