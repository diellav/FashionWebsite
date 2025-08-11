<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart_Items;
use Illuminate\Support\Facades\Validator;

class Cart_ItemsController extends Controller
{
      public function getCart_Items(){
         $userId = auth()->id();
        $cartItems= Cart_Items::with(['cart','product','variants'])
             ->whereHas('cart', function ($query) use ($userId) {
            $query->where('userID', $userId);
        })->get();
        $cartItems->each(function ($item) {
        $item->product->discounted_price = $item->product->discounted_price;
    });
    return $cartItems;
    }
    public function getCart_ItemsDashboard($cartID){
          return Cart_Items::with(['cart','product', 'variants'])
        ->where('cartID', $cartID)
        ->get();
    }
    public function getCart_ItemID($id){
        $cart_Item=Cart_Items::with(['cart','product','variants'])->findOrFail($id);
        return response()->json($cart_Item);
    }

     public function createCart_Item(Request $request) {
        $validator = Validator::make($request->all(), [
            'cartID' => 'required|exists:cart,id',
            'productID' => 'required|exists:products,id',
            'variantID' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $cart_Item = Cart_Items::create([
            'cartID' => $request->get('cartID'),
            'productID' => $request->get('productID'),
            'variantID' => $request->get('variantID'),
            'quantity' => $request->get('quantity'),
        ]);

        return response()->json($cart_Item, 201);
    }

    public function updateCart_Item(Request $request, $id) {
        $cart_Item = Cart_Items::findOrFail($id);

        $cart_Item->update($request->only([
            'cartID','productID','variantID', 'quantity'
        ]));

        return response()->json($cart_Item);
    }
    public function deleteCart_Item($id) {
        $cart_Item = Cart_Items::findOrFail($id);
        $cart_Item->delete();
        return response()->json(['message' => 'Cart Item deleted successfully']);
    }
}
