<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherRecord extends Model
{
    protected $table = 'weather_records';

    protected $fillable = [
        'city',
        'cep',
        'country',
        'temperature',
        'humidity',
        'wind_speed',
        'description',
        'icon',
        'raw_data'
    ];

    protected $casts = [
        'raw_data' => 'array',
    ];
}
