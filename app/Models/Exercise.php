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

    protected $casts = [
        'exercise_types' => 'array'
    ];

    public static function getUniqueTypes()
    {
        return self::where('user_id', auth()->id())
                   ->select('type')
                   ->get()
                   ->pluck('type')
                   ->flatMap(function ($type) {
                       return is_array($type) ? $type : explode(',', $type);
                   })
                   ->unique()
                   ->filter()
                   ->values()
                   ->toArray();
    }

    public function setTypeAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['type'] = implode(',', array_filter($value));
        } else {
            $this->attributes['type'] = $value;
        }
    }

    public function getTypeAttribute($value)
    {
        if (empty($value)) return [];
        return is_array($value) ? $value : explode(',', $value);
    }

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
