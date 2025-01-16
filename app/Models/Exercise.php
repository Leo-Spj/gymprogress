<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'image_url',
        'image_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function routines()
    {
        return $this->belongsToMany(Routine::class, 'routine_exercises')
                    ->withPivot('order_index');
    }

    public function workoutSets()
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
