<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart_Items;
use App\Models\Sizes;
use Illuminate\Support\Facades\Validator;

class Cart_ItemsController extends Controller
{
      public function getCart_Items(){
         $userId = auth()->id();
        $cartItems= Cart_Items::with(['cart','product','variants', 'sizes'])
             ->whereHas('cart', function ($query) use ($userId) {
            $query->where('userID', $userId);
        })->get();
        $cartItems->each(function ($item) {
        $item->product->discounted_price = $item->product->discounted_price;
    });
    return $cartItems;
    }
    public function getCart_ItemsDashboard($cartID){
          return Cart_Items::with(['cart','product', 'variants','sizes'])
        ->where('cartID', $cartID)
        ->get();
    }
    public function getCart_ItemID($id){
        $cart_Item=Cart_Items::with(['cart','product','variants', 'sizes'])->findOrFail($id);
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
        $size = Sizes::find($request->get('sizeID'));
        if ($size && $size->stock < $request->get('quantity')) {
            return response()->json(['error' => 'Not enough stock available for this size'], 400);
        }
        $cart_Item = Cart_Items::create([
            'cartID' => $request->get('cartID'),
            'productID' => $request->get('productID'),
            'variantID' => $request->get('variantID'),
             'sizeID' => $request->get('sizeID'),
            'quantity' => $request->get('quantity'),
        ]);

        return response()->json($cart_Item, 201);
    }

    public function updateCart_Item(Request $request, $id) {
        $cart_Item = Cart_Items::findOrFail($id);

        $cart_Item->update($request->only([
            'cartID','productID','variantID','sizeID', 'quantity'
        ]));

        return response()->json($cart_Item);
    }
    public function deleteCart_Item($id) {
        $cart_Item = Cart_Items::findOrFail($id);
        $cart_Item->delete();
        return response()->json(['message' => 'Cart Item deleted successfully']);
    }
}
