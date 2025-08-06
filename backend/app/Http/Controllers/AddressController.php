<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function getAddresses() {
        return Address::with('user')->get();
    }

    public function getAddressID($id) {
        $address = Address::with('user')->findOrFail($id);
        return response()->json($address);
    }

    public function createAddress(Request $request) {
        $validator = Validator::make($request->all(), [
            'userID' => 'required|exists:users,id',
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $address = Address::create([
            'userID' => $request->input('userID'),
            'country' => $request->input('country'),
            'city' => $request->input('city'),
            'postal_code' => $request->input('postal_code'),
            'address' => $request->input('address'),
        ]);

        return response()->json($address, 201);
    }

    public function updateAddress(Request $request, $id) {
        $address = Address::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $address->update([
            'country' => $request->input('country'),
            'city' => $request->input('city'),
            'postal_code' => $request->input('postal_code'),
            'address' => $request->input('address'),
        ]);

        return response()->json($address);
    }

    public function deleteAddress($id) {
        $address = Address::findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
      public function myAddresses()
    {
        $userId = Auth::id();
        $addresses = Address::where('userID', $userId)->get();
        return response()->json($addresses);
    }
}
