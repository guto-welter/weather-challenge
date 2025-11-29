<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('search_histories', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('country')->nullable();
            $table->string('cep')->nullable();
            $table->float('temperature')->nullable();
            $table->integer('humidity')->nullable();
            $table->float('wind_speed')->nullable();
            $table->float('feelslike')->nullable();
            $table->string('description')->nullable();
            $table->string('icon')->nullable();
            $table->json('raw_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_histories');
    }
};
