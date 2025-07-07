<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
     public function getCarts(){
        return Cart::with('user')->get();
    }
    public function getCartID($id){
        $cart=Cart::with('user')->findOrFail($id);
        return response()->json($cart);
    }

     public function createCart(Request $request) {
        $validator = Validator::make($request->all(), [
            'userID' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $cart = Cart::create([
            'userID' => $request->get('userID'),
        ]);

        return response()->json($cart, 201);
    }

    public function updateCart(Request $request, $id) {
        $cart = Cart::findOrFail($id);

        $cart->update($request->only([
            'userID'
        ]));

        return response()->json($cart);
    }
    public function deleteCart($id) {
        $cart = Cart::findOrFail($id);
        $cart->delete();
        return response()->json(['message' => 'Cart deleted successfully']);
    }
}
