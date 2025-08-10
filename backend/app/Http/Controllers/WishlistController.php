<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function getWishlistsDashboard(Request $request){
            $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = Wishlist::query();
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              >orWhereHas('user', function($q2) use ($search) {
                  $q2->where('first_name', 'like', "%$search%");
        })->orWhereHas('product', function($q2) use ($search) {
                  $q2->where('name', 'like', "%$search%");
        })->orWhereHas('variant', function($q2) use ($search) {
                  $q2->where('color', 'like', "%$search%");
        });
    });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }
     public function getWishlists(){
         $userId = auth()->id();
        $wishlists= Wishlist::with(['user', 'product','variant'])->where('userID', $userId)->get();
        $wishlists->each(function ($item) {
        $item->product->discounted_price = $item->product->discounted_price;
    });
    return $wishlists;
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
            $productID = $request->get('productID');
           if (!$productID && $request->get('variantID')) {
        $variant = \App\Models\ProductVariant::find($request->get('variantID'));
        if ($variant) {
            $productID = $variant->productID; 
        }
    }


        $wishlist = Wishlist::create([
            'userID' => Auth::check() ? Auth::id() : $request->get('userID'),
            'productID' => $productID,
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
