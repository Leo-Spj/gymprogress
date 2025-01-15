<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RoutineController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $routines = auth()->user()->routines()->with('exercises')->get();
        return Inertia::render('Routines/Index', [
            'routines' => $routines
        ]);
    }

    public function create()
    {
        $exercises = auth()->user()->exercises()->get();
        return Inertia::render('Routines/Create', [
            'exercises' => $exercises
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'array',
            'exercises' => 'array',
        ]);

        $routine = auth()->user()->routines()->create($validated);

        if (isset($validated['exercises'])) {
            foreach ($validated['exercises'] as $index => $exerciseId) {
                $routine->exercises()->attach($exerciseId, ['order_index' => $index + 1]);
            }
        }

        return redirect()->route('routines.index');
    }

    public function show(Routine $routine)
    {
        $this->authorize('view', $routine);
        $routine->load('exercises');
        
        return Inertia::render('Routines/Show', [
            'routine' => $routine
        ]);
    }

    public function edit(Routine $routine)
    {
        $this->authorize('update', $routine);
        $routine->load('exercises'); // Asegurar que los ejercicios estén cargados
        $exercises = auth()->user()->exercises()->get();
        
        return Inertia::render('Routines/Edit', [
            'routine' => array_merge($routine->toArray(), [
                'days' => $routine->days ?? [], // Asegurar que days siempre sea un array
            ]),
            'exercises' => $exercises
        ]);
    }

    public function update(Request $request, Routine $routine)
    {
        $this->authorize('update', $routine);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'array',
            'exercises' => 'array',
        ]);

        $routine->update([
            'name' => $validated['name'],
        ]);

        if (isset($validated['exercises'])) {
            // Crear un array asociativo con order_index para cada ejercicio
            $exercisesWithOrder = [];
            foreach ($validated['exercises'] as $index => $exerciseId) {
                $exercisesWithOrder[$exerciseId] = ['order_index' => $index + 1];
            }
            
            $routine->exercises()->sync($exercisesWithOrder);
        }

        return redirect()->route('routines.index');
    }

    public function destroy(Routine $routine)
    {
        $this->authorize('delete', $routine);
        $routine->delete();

        return redirect()->route('routines.index');
    }

    public function addExercise(Request $request, Routine $routine)
    {
        $this->authorize('update', $routine);
        $validated = $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
        ]);

        $routine->exercises()->attach($validated['exercise_id'], ['order_index' => $routine->exercises()->count() + 1]);

        return redirect()->route('routines.show', $routine);
    }

    public function removeExercise(Routine $routine, $exerciseId)
    {
        $this->authorize('update', $routine);
        $routine->exercises()->detach($exerciseId);

        return redirect()->route('routines.show', $routine);
    }

    public function showAddExerciseForm(Routine $routine)
    {
        $this->authorize('update', $routine);
        $exercises = auth()->user()->exercises()->whereNotIn('id', $routine->exercises->pluck('id'))->get();
        
        return Inertia::render('Routines/AddExercise', [
            'routine' => $routine,
            'exercises' => $exercises
        ]);
    }
}