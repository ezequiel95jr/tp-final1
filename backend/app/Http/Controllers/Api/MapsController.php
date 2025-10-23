<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MapsController extends Controller
{
    public function geocode(Request $request)
    {
        $address = $request->input('address');
        $key = config('services.google.maps_key');

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $address,
            'key' => $key,
        ]);

        return $response->json();
    }
}
