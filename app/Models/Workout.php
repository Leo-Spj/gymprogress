<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sets()
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
