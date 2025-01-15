<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Routine extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name'
    ];

    protected $appends = ['days'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'routine_exercises')
                    ->withPivot('order_index')
                    ->orderBy('order_index');
    }

    public function routineDays()
    {
        return $this->hasMany(RoutineDay::class);
    }

    public function getDaysAttribute()
    {
        return $this->routineDays->pluck('day_of_week')->toArray();
    }
}
