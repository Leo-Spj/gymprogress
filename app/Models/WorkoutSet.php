<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkoutSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_id',
        'exercise_id',
        'reps',
        'weight',
        'duration_seconds'
    ];

    public function workout()
    {
        return $this->belongsTo(Workout::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
