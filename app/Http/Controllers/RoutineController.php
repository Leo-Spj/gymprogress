<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use Illuminate\Http\Request;

class RoutineController extends Controller
{
    public function index()
    {
        $routines = auth()->user()->routines()->with(['routineDays', 'exercises'])->get();
        return response()->json($routines);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $routine = auth()->user()->routines()->create($validated);
        return response()->json($routine, 201);
    }

    public function show(Routine $routine)
    {
        $this->authorize('view', $routine);
        return response()->json($routine->load(['routineDays', 'exercises']));
    }

    public function update(Request $request, Routine $routine)
    {
        $this->authorize('update', $routine);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $routine->update($validated);
        return response()->json($routine);
    }

    public function destroy(Routine $routine)
    {
        $this->authorize('delete', $routine);
        $routine->delete();
        return response()->json(null, 204);
    }
}
