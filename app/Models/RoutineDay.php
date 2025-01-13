<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoutineDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'routine_id',
        'day_of_week'
    ];

    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }
}
