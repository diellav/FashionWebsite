<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
     public function getCartsDashboard(){
        return Cart::with('user')->withCount('items')->get();
    }
    public function getCarts(Request $request){
        $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = Cart::with('user')->withCount('items');
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhereHas('user', function($q2) use ($search) {
                  $q2->where('first_name', 'like', "%$search%");
        });});
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
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
        $userId = $request->input('userID');
        $existing = Cart::where('userID', $userId)->first();
            if ($existing) {
                return response()->json($existing, 200);
            }
        
        $cart = Cart::create([
            'userID' => $userId
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
