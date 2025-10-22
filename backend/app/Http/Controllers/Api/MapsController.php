<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MapsController extends Controller
{
    protected function key(): string
    {
        return (string) config('services.google.maps_server_key');
    }

    public function geocode(Request $request)
    {
        $data = $request->validate(['address' => 'required|string|max:255']);
        $resp = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $data['address'],
            'key' => $this->key(),
        ]);
        $json = $resp->json();
        $r = $json['results'][0] ?? null;
        return response()->json([
            'ok' => $resp->successful(),
            'lat' => $r['geometry']['location']['lat'] ?? null,
            'lng' => $r['geometry']['location']['lng'] ?? null,
            'formatted_address' => $r['formatted_address'] ?? null,
            'raw' => $json,
        ], $resp->status());
    }

    public function reverseGeocode(Request $request)
    {
        $data = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);
        $resp = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'latlng' => $data['lat'].','.$data['lng'],
            'key' => $this->key(),
        ]);
        $json = $resp->json();
        $r = $json['results'][0] ?? null;
        return response()->json([
            'ok' => $resp->successful(),
            'formatted_address' => $r['formatted_address'] ?? null,
            'raw' => $json,
        ], $resp->status());
    }

    public function placesAutocomplete(Request $request)
    {
        $data = $request->validate([
            'input' => 'required|string|max:120',
            'sessiontoken' => 'nullable|string|max:50',
            'location' => 'nullable|string',
            'radius' => 'nullable|integer|min:1|max:100000',
            'language' => 'nullable|string|max:10',
        ]);
        $params = [
            'input' => $data['input'],
            'key' => $this->key(),
        ];
        if (!empty($data['sessiontoken'])) $params['sessiontoken'] = $data['sessiontoken'];
        if (!empty($data['location'])) $params['location'] = $data['location'];
        if (!empty($data['radius'])) $params['radius'] = $data['radius'];
        if (!empty($data['language'])) $params['language'] = $data['language'];

        $resp = Http::get('https://maps.googleapis.com/maps/api/place/autocomplete/json', $params);
        return response()->json($resp->json(), $resp->status());
    }

    public function directions(Request $request)
    {
        $data = $request->validate([
            'origin' => 'required|string',
            'destination' => 'required|string',
            'mode' => 'nullable|in:driving,walking,bicycling,transit',
            'language' => 'nullable|string|max:10',
        ]);
        $params = [
            'origin' => $data['origin'],
            'destination' => $data['destination'],
            'key' => $this->key(),
        ];
        if (!empty($data['mode'])) $params['mode'] = $data['mode'];
        if (!empty($data['language'])) $params['language'] = $data['language'];

        $resp = Http::get('https://maps.googleapis.com/maps/api/directions/json', $params);
        return response()->json($resp->json(), $resp->status());
    }
}
