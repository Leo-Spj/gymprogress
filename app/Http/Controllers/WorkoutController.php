<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Exercise;
use App\Models\WorkoutSet;
use Illuminate\Support\Facades\DB;

class WorkoutController extends Controller
{
    public function index()
    {
        $workouts = auth()->user()->workouts()->with('sets.exercise')->get();
        return response()->json($workouts);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $today = now()->toDateString();

        $existingWorkout = $user->workouts()->whereDate('workout_date', $today)->first();

        if ($existingWorkout) {
            return redirect()->route('routines.show', $request->routine_id);
        }

        $workout = $user->workouts()->create(['workout_date' => $today]);
        return redirect()->route('routines.show', $request->routine_id);
    }

    public function show(Workout $workout)
    {
        $this->authorize('view', $workout);
        return response()->json($workout->load('sets.exercise'));
    }

    public function update(Request $request, Workout $workout)
    {
        $this->authorize('update', $workout);
        $validated = $request->validate([
            'workout_date' => 'required|date',
        ]);

        $workout->update($validated);
        return response()->json($workout);
    }

    public function destroy(Workout $workout)
    {
        $this->authorize('delete', $workout);
        $workout->delete();
        return response()->json(null, 204);
    }

    public function getOrCreate(Request $request)
    {
        $user = auth()->user();
        $date = $request->input('date') ? date('Y-m-d', strtotime($request->input('date'))) : now()->toDateString();

        $workout = $user->workouts()
            ->whereDate('workout_date', $date)
            ->first();

        if (!$workout) {
            $workout = $user->workouts()->create(['workout_date' => $date]);
        }

        return response()->json($workout);
    }

    public function trends(Exercise $exercise)
    {
        $trends = DB::table('workout_sets')
            ->join('workouts', 'workouts.id', '=', 'workout_sets.workout_id')
            ->where('exercise_id', $exercise->id)
            ->where('workouts.user_id', auth()->id())
            ->select(
                'workout_sets.id',
                'workout_sets.reps',
                'workout_sets.weight',
                'workouts.workout_date as date'
            )
            ->orderBy('workouts.workout_date')
            ->orderBy('workout_sets.id')
            ->get();

        return Inertia::render('Exercise/Trends', [
            'exercise' => $exercise,
            'trendsData' => $trends
        ]);
    }
}
