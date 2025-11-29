<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

Route::post('/weather', [WeatherController::class, 'store']);
Route::get('/weather', [WeatherController::class, 'index']);

Route::post('/weather/compare', [WeatherController::class, 'compare']);

Route::get('/history', [WeatherController::class, 'history']);
Route::post('/history', [WeatherController::class, 'addHistory']);
Route::get('/weather/{city}', [WeatherController::class, 'getWeather']);
