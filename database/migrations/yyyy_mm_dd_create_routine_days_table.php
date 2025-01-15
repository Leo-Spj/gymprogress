<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('routine_days');
        
        Schema::create('routine_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_id')->constrained()->onDelete('cascade');
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('routine_days');
    }
};
