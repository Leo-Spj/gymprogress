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

        // Establecer valor por defecto para duration_seconds
        if (!isset($validated['duration_seconds'])) {
            $validated['duration_seconds'] = 30;
        }

        $set = $workout->sets()->create($validated);
        return response()->json($set, 201);
    }

    public function update(Request $request, WorkoutSet $set)
    {
        // Verificar que el workout pertenece al usuario actual
        if ($set->workout->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        
        $validated = $request->validate([
            'reps' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'duration_seconds' => 'integer|min:0',
        ]);

        try {
            $set->update($validated);
            return response()->json($set->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el set'], 500);
        }
    }

    public function destroy(WorkoutSet $set)
    {
        // Verificar que el workout pertenece al usuario actual
        if ($set->workout->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        try {
            $set->delete();
            return response()->json(['message' => 'Set eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el set'], 500);
        }
    }
}
