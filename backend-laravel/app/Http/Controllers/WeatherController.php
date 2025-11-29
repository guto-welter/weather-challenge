<?php

namespace App\Http\Controllers;

use App\Models\WeatherRecord;
use App\Models\SearchHistory;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function store(Request $request)
    {
        $weather = WeatherRecord::create([
            'city' => $request->city,
            'country' => $request->country,
            'temperature' => $request->temperature,
            'humidity' => $request->humidity,
            'description' => $request->description,
            'icon' => $request->icon,
            'raw_data' => $request->raw_data,
        ]);

        Log::debug($weather);

        return response()->json($weather, 201);
    }

    public function index()
    {
        return WeatherRecord::orderBy('id', 'desc')->get();
    }

    public function compare(Request $request)
    {
        $request->validate([
            'city1' => 'required|string',
            'city2' => 'required|string',
        ]);

        $city1Record = SearchHistory::where('city', 'like', '%' . explode(',', $request->city1)[0] . '%')
            ->orderBy('created_at', 'desc')
            ->first();

        $city2Record = SearchHistory::where('city', 'like', '%' . explode(',', $request->city2)[0] . '%')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$city1Record) {
            $city1Data = $this->weatherService->getCurrentWeather($request->city1);

            if (isset($city1Data['success']) && $city1Data['success'] === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não foi possível obter dados para ' . $request->city1,
                ], 400);
            }

            $city1 = [
                'city' => $city1Data['location']['name'],
                'country' => $city1Data['location']['country'],
                'temperature' => $city1Data['current']['temperature'],
                'humidity' => $city1Data['current']['humidity'],
                'wind_speed' => $city1Data['current']['wind_speed'],
                'feelslike' => $city1Data['current']['feelslike'],
                'description' => $city1Data['current']['weather_descriptions'][0] ?? null,
                'icon' => $city1Data['current']['weather_icons'][0] ?? null,
            ];
        } else {
            $city1 = [
                'city' => $city1Record->city,
                'country' => $city1Record->country,
                'temperature' => $city1Record->temperature,
                'humidity' => $city1Record->humidity,
                'wind_speed' => $city1Record->wind_speed,
                'feelslike' => $city1Record->feelslike,
                'description' => $city1Record->description,
                'icon' => $city1Record->icon,
            ];
        }

        if (!$city2Record) {
            $city2Data = $this->weatherService->getCurrentWeather($request->city2);

            if (isset($city2Data['success']) && $city2Data['success'] === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não foi possível obter dados para ' . $request->city2,
                ], 400);
            }

            $city2 = [
                'city' => $city2Data['location']['name'],
                'country' => $city2Data['location']['country'],
                'temperature' => $city2Data['current']['temperature'],
                'humidity' => $city2Data['current']['humidity'],
                'wind_speed' => $city2Data['current']['wind_speed'],
                'feelslike' => $city2Data['current']['feelslike'],
                'description' => $city2Data['current']['weather_descriptions'][0] ?? null,
                'icon' => $city2Data['current']['weather_icons'][0] ?? null,
            ];
        } else {
            $city2 = [
                'city' => $city2Record->city,
                'country' => $city2Record->country,
                'temperature' => $city2Record->temperature,
                'humidity' => $city2Record->humidity,
                'wind_speed' => $city2Record->wind_speed,
                'feelslike' => $city2Record->feelslike,
                'description' => $city2Record->description,
                'icon' => $city2Record->icon,
            ];
        }

        return response()->json([
            'success' => true,
            'city1' => $city1,
            'city2' => $city2,
            'comparison' => [
                'temperature_diff' => $city1['temperature'] - $city2['temperature'],
                'humidity_diff' => $city1['humidity'] - $city2['humidity'],
                'wind_speed_diff' => $city1['wind_speed'] - $city2['wind_speed'],
            ]
        ]);
    }


    public function history()
    {
        return SearchHistory::select([
            'id',
            'city',
            'cep',
            'country',
            'temperature',
            'humidity',
            'wind_speed',
            'feelslike',
            'description',
            'icon',
            'created_at'
        ])
            ->orderBy('created_at', 'desc')
            ->get();
    }


    public function addHistory(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'country' => 'nullable|string',
            'cep' => 'nullable|string',
            'temperature' => 'nullable|numeric',
            'humidity' => 'nullable|numeric',
            'wind_speed' => 'nullable|numeric',
            'feelslike' => 'nullable|numeric',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'raw_data' => 'nullable|array',
        ]);

        return SearchHistory::create([
            'city' => $request->city,
            'country' => $request->country,
            'cep' => $request->cep,
            'temperature' => $request->temperature,
            'humidity' => $request->humidity,
            'wind_speed' => $request->wind_speed,
            'feelslike' => $request->feelslike,
            'description' => $request->description,
            'icon' => $request->icon,
            'raw_data' => $request->raw_data,
        ]);
    }


    public function getWeather($city)
    {
        $data = $this->weatherService->getCurrentWeather($city);

        if (isset($data['success']) && $data['success'] === false) {
            return response()->json($data, 400);
        }

        return response()->json([
            'city' => $data['location']['name'],
            'country' => $data['location']['country'],
            'region' => $data['location']['region'],
            'localtime' => $data['location']['localtime'],
            'temperature' => $data['current']['temperature'],
            'description' => $data['current']['weather_descriptions'][0] ?? null,
            'icon' => $data['current']['weather_icons'][0] ?? null,
            'wind_speed' => $data['current']['wind_speed'],
            'humidity' => $data['current']['humidity'],
            'feelslike' => $data['current']['feelslike'],
            'raw_data' => $data
        ]);
    }
}
