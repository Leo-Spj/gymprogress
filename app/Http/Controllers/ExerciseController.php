<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
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
        return Inertia::render('Exercises/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
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
            $exercise->type = $validated['type'];
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
}