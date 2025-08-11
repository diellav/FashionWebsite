<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Order_Items;
use App\Models\Cart_Items;
use App\Models\Payment;
use App\Models\Address;
use Stripe\Stripe;
use Stripe\Charge;

class OrderController extends Controller
{
     public function getOrdersDashboard(){
        return Order::with('user')->get();
    }
    public function getOrders(Request $request){
         $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = Order::with('user')->withCount('items');
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhereHas('user', function($q2) use ($search) {
                  $q2->where('first_name', 'like', "%$search%");
        })->orWhere('total_price', 'like', "%$search%")
        ->orWhere('shipping_address', 'like', "%$search%")
        ->orWhere('payment_method', 'like', "%$search%")
        ->orWhere('status', 'like', "%$search%");
    });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }
    public function getOrderID($id){
        $order=Order::with('user')->findOrFail($id);
        return response()->json($order);
    }

    public function checkout(Request $request) {
    $user = Auth::user();

    $validator = Validator::make($request->all(), [
        'stripeToken' => 'required|string',
        'address_id' => 'nullable|exists:addresses,id',
        'shipping_address' => 'required_if:address_id,null|string|max:255',
        'country' => 'required_if:address_id,null|string|max:255',
        'city' => 'required_if:address_id,null|string|max:255',
        'postal_code' => 'required_if:address_id,null|string|max:20',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 400);
    }

    $stripeToken = $request->input('stripeToken');

    $cartItems = Cart_Items::with('product')
        ->whereHas('cart', function ($q) use ($user) {
            $q->where('userID', $user->id);
        })->get();

    if ($cartItems->isEmpty()) {
        return response()->json(['error' => 'Cart is empty'], 400);
    }

    $totalPrice = 0;
    foreach ($cartItems as $item) {
        $totalPrice += $item->product->price * $item->quantity;
    }

    DB::beginTransaction();

    try {
        if ($request->has('address_id')) {
            $address = Address::where('userID', $user->id)
                ->findOrFail($request->address_id);
        } else {
            $address = Address::create([
                'userID' => $user->id,
                'country' => $request->input('country'),
                'city' => $request->input('city'),
                'postal_code' => $request->input('postal_code'),
                'address' => $request->input('shipping_address'),
            ]);
        }

        $order = Order::create([
            'userID' => $user->id,
            'total_price' => $totalPrice,
            'shipping_address' => $address->address,
            'country' => $address->country,
            'city' => $address->city,
            'postal_code' => $address->postal_code,
            'payment_method' => 'stripe',
            'status' => 'pending',
        ]);

        foreach ($cartItems as $item) {
            Order_Items::create([
                'orderID' => $order->id,
                'productID' => $item->productID,
                'product_variantID' => $item->variantID ?? null,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $charge = \Stripe\Charge::create([
            'amount' => intval($totalPrice * 100),
            'currency' => 'eur',
            'source' => $stripeToken,
            'description' => 'Order from user ID: ' . $user->id
        ]);

        Payment::create([
            'userID' => $user->id,
            'orderID' => $order->id,
            'total_price' => $totalPrice,
            'payment_status' => 'paid',
            'transaction_reference' => $charge->id,
        ]);

        foreach ($cartItems as $item) {
            $item->delete();
        }

        DB::commit();

        return response()->json(['message' => 'Order completed successfully', 'orderID' => $order->id], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Checkout failed: ' . $e->getMessage()], 500);
    }
}

    public function updateOrder(Request $request, $id) {
        $order = Order::findOrFail($id);

        $order->update($request->only([
            'userID','total_price', 'shipping_address', 'payment_method', 'status'
        ]));

        return response()->json($order);
    }
    public function deleteOrder($id) {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
    public function myOrders(){
    $userId = auth()->id();
    $orders = Order::where('userID', $userId)->get();
    return response()->json($orders);
}

}
