<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
     public function getWishlists(){
         $userId = auth()->id();
        return Wishlist::with(['user', 'product','variant'])->where('userID', $userId)->get();
    }

    public function getWishlistID($id){
        $wishlist=Wishlist::with(['user', 'product','variant'])->findOrFail($id);
        return response()->json($wishlist);
    }

     public function createWishlist(Request $request) {
        $validator = Validator::make($request->all(), [
            'productID' => 'nullable|exists:products,id',
            'variantID' => 'nullable|exists:product_variants,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $wishlist = Wishlist::create([
            'userID' => Auth::check() ? Auth::id() : $request->get('userID'),
            'productID' => $request->get('productID'),
            'variantID' => $request->get('variantID'),
        ]);

        return response()->json($wishlist, 201);
    }

    public function updateWishlist(Request $request, $id) {
        $wishlist = Wishlist::findOrFail($id);

        $wishlist->update($request->only([
            'userID','productID', 'variantID'
        ]));

        return response()->json($wishlist);
    }
    public function deleteWishlist($id) {
        $wishlist = Wishlist::findOrFail($id);
        $wishlist->delete();
        return response()->json(['message' => 'Wishlist deleted successfully']);
    }
}
