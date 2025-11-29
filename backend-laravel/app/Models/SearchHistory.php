<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchHistory extends Model
{
    protected $table = 'search_histories';

    protected $fillable = [
        'city',
        'country',
        'cep',
        'temperature',
        'humidity',
        'wind_speed',
        'feelslike',
        'description',
        'icon',
        'raw_data'
    ];

    protected $casts = [
        'raw_data' => 'array',
        'temperature' => 'float',
        'humidity' => 'integer',
        'wind_speed' => 'float',
        'feelslike' => 'float'
    ];
}
