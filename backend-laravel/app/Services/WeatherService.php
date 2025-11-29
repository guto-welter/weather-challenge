<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('WEATHERSTACK_KEY');
    }

    public function getCurrentWeather($city)
    {
        $url = "http://api.weatherstack.com/current";

        $response = Http::get($url, [
            'access_key' => $this->apiKey,
            'query' => $city
        ]);

        return $response->json();
    }
}
