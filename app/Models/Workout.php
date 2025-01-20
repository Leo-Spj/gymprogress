<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'workout_date'
    ];

    protected $casts = [
        'workout_date' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sets(): HasMany
    {
        return $this->hasMany(WorkoutSet::class);
    }

    public function workoutSets(): HasMany
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
