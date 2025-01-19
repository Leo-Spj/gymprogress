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
            'type' => 'required',
            'image_url' => 'nullable|url|max:2083',
            'image' => 'nullable|image|max:5120',
        ]);

        try {
            \DB::beginTransaction();

            // Procesar imagen si se proporcionó una nueva
            if ($request->hasFile('image')) {
                // Eliminar imagen anterior
                if ($exercise->image_path) {
                    Storage::disk('public')->delete($exercise->image_path);
                }
                
                $path = $request->file('image')->store('exercises', 'public');
                $exercise->image_path = $path;
            }

            // Actualizar otros campos
            $exercise->name = $validated['name'];
            $exercise->type = json_decode($validated['type']);
            $exercise->image_url = $validated['image_url'] ?? null;
            
            $exercise->save();

            \DB::commit();
            
            return redirect()->route('exercises.index')
                            ->with('success', 'Ejercicio actualizado correctamente');

        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error actualizando ejercicio: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Error al actualizar el ejercicio']);
        }
    }

    public function destroy(Exercise $exercise)
    {
        $this->authorize('delete', $exercise);
        
        try {
            \DB::beginTransaction();
            
            // Eliminar la imagen si existe
            if ($exercise->image_path) {
                \Log::info('Eliminando imagen: ' . $exercise->image_path);
                if (Storage::disk('public')->exists($exercise->image_path)) {
                    Storage::disk('public')->delete($exercise->image_path);
                    \Log::info('Imagen eliminada con éxito');
                } else {
                    \Log::warning('Imagen no encontrada en el servidor: ' . $exercise->image_path);
                }
            }
            
            // Eliminar el ejercicio
            $exercise->delete();
            
            \DB::commit();
            \Log::info('Ejercicio eliminado con éxito: ' . $exercise->id);
            
            return redirect()->route('exercises.index')
                            ->with('success', 'Ejercicio eliminado correctamente');
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error al eliminar ejercicio: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Error al eliminar el ejercicio']);
        }
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