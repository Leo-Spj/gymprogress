<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class RoutineController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $routines = auth()->user()->routines()
            ->with(['exercises', 'routineDays'])
            ->get();
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
            'days.*' => 'distinct|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'exercises' => 'array',
        ]);

        $routine = auth()->user()->routines()->create([
            'name' => $validated['name']
        ]);

        if (isset($validated['exercises'])) {
            foreach ($validated['exercises'] as $index => $exerciseId) {
                $routine->exercises()->attach($exerciseId, ['order_index' => $index + 1]);
            }
        }

        if (isset($validated['days'])) {
            foreach ($validated['days'] as $day) {
                $routine->routineDays()->create([
                    'day_of_week' => $day
                ]);
            }
        }

        return redirect()->route('routines.index');
    }

    public function show(Routine $routine)
    {
        $this->authorize('view', $routine);
        $routine->load(['exercises', 'routineDays']);
        
        return Inertia::render('Routines/Show', [
            'routine' => $routine
        ]);
    }

    public function edit(Routine $routine)
    {
        $this->authorize('update', $routine);
        $routine->load(['exercises', 'routineDays']);
        $exercises = auth()->user()->exercises()->get();
        
        // Asegurarnos de que los días están en minúsculas para coincidir con el formulario
        $days = $routine->routineDays->pluck('day_of_week')
            ->map(fn($day) => strtolower($day))
            ->toArray();
        
        return Inertia::render('Routines/Edit', [
            'routine' => array_merge($routine->toArray(), [
                'days' => $days
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
            'days.*' => 'distinct|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'exercises' => 'array',
        ]);

        $routine->update([
            'name' => $validated['name'],
        ]);

        if (isset($validated['exercises'])) {
            $exercisesWithOrder = [];
            foreach ($validated['exercises'] as $index => $exerciseId) {
                $exercisesWithOrder[$exerciseId] = ['order_index' => $index + 1];
            }
            
            $routine->exercises()->sync($exercisesWithOrder);
        }

        // Actualizar los días de la rutina
        $routine->routineDays()->delete(); // Eliminar días existentes
        if (isset($validated['days'])) {
            foreach ($validated['days'] as $day) {
                $routine->routineDays()->create([
                    'day_of_week' => $day
                ]);
            }
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
        try {
            $routine->exercises()->detach($exerciseId);
            return response()->json([
                'success' => true,
                'message' => 'Ejercicio eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el ejercicio'
            ], 500);
        }
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

    public function updateExercisesOrder(Request $request, Routine $routine)
    {
        $this->authorize('update', $routine);
        
        $validated = $request->validate([
            'exercises' => 'required|array',
            'exercises.*.id' => 'required|exists:exercises,id',
            'exercises.*.order_index' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();
            
            foreach ($validated['exercises'] as $exercise) {
                $routine->exercises()->updateExistingPivot(
                    $exercise['id'],
                    ['order_index' => $exercise['order_index']]
                );
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Orden actualizado correctamente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el orden'
            ], 500);
        }
    }
}