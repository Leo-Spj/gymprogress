<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Workout;
use App\Models\WorkoutSet; // Añadir esta línea
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
        $existingTypes = Exercise::getUniqueTypes();
        return Inertia::render('Exercises/Create', [
            'existingTypes' => $existingTypes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|array', // Cambiado de string a array
            'type.*' => 'string|max:255', // Validación para cada elemento del array
            'image_url' => 'nullable|url|max:2083',
            'image' => 'nullable|image|max:5120', // Permitir imágenes hasta 5MB
        ]);

        $validated['user_id'] = auth()->id();
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('exercises', 'public');
            $validated['image_path'] = $path;
        }

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
        $existingTypes = Exercise::getUniqueTypes();
        return Inertia::render('Exercises/Edit', [
            'exercise' => $exercise,
            'existingTypes' => $existingTypes
        ]);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $this->authorize('update', $exercise);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|json', // Cambiado para aceptar JSON string
            'image_url' => 'nullable|url|max:2083',
            'image' => 'nullable|image|max:5120',
        ]);

        try {
            \DB::beginTransaction();

            if ($request->hasFile('image')) {
                // Eliminar imagen anterior si existe
                if ($exercise->image_path) {
                    Storage::disk('public')->delete($exercise->image_path);
                }
                
                $path = $request->file('image')->store('exercises', 'public');
                $exercise->image_path = $path;
            }

            $exercise->name = $validated['name'];
            $exercise->type = json_decode($validated['type']); // Decodificar el JSON
            $exercise->image_url = $validated['image_url'] ?? null;
            
            $exercise->save();

            \DB::commit();
            return redirect()->route('exercises.index');

        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar el ejercicio: ' . $e->getMessage()]);
        }
    }

    public function destroy(Exercise $exercise)
    {
        $this->authorize('delete', $exercise);
        
        if ($exercise->image_path) {
            Storage::disk('public')->delete($exercise->image_path);
        }
        
        $exercise->delete();
        return response()->json(null, 204);
    }

    public function getLatestWorkoutSets($exerciseId)
    {
        $latestWorkout = Workout::where('user_id', auth()->id())
            ->orderBy('workout_date', 'desc')
            ->first();

        if (!$latestWorkout) {
            return response()->json([]);
        }

        $sets = WorkoutSet::where('workout_id', $latestWorkout->id)
            ->where('exercise_id', $exerciseId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'workout_date' => $latestWorkout->workout_date,
            'sets' => $sets
        ]);
    }
}