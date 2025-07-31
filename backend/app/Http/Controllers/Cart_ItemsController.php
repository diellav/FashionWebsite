<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart_Items;
use Illuminate\Support\Facades\Validator;

class Cart_ItemsController extends Controller
{
      public function getCart_Items(){
         $userId = auth()->id();
        return Cart_Items::with(['cart','products'])
             ->whereHas('cart', function ($query) use ($userId) {
            $query->where('userID', $userId);
        })->get();
    }
    public function getCart_ItemID($id){
        $cart_Item=Cart_Items::with(['cart','products'])->findOrFail($id);
        return response()->json($cart_Item);
    }

     public function createCart_Item(Request $request) {
        $validator = Validator::make($request->all(), [
            'cartID' => 'required|exists:cart,id',
            'productID' => 'required|exists:products,id',
            'quantity' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $cart_Item = Cart_Items::create([
            'cartID' => $request->get('cartID'),
            'productID' => $request->get('productID'),
            'quantity' => $request->get('quantity'),
        ]);

        return response()->json($cart_Item, 201);
    }

    public function updateCart_Item(Request $request, $id) {
        $cart_Item = Cart_Items::findOrFail($id);

        $cart_Item->update($request->only([
            'cartID','productID', 'quantity'
        ]));

        return response()->json($cart_Item);
    }
    public function deleteCart_Item($id) {
        $cart_Item = Cart_Items::findOrFail($id);
        $cart_Item->delete();
        return response()->json(['message' => 'Cart Item deleted successfully']);
    }
}
