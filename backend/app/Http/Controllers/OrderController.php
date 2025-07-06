<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
     public function getOrders(){
        return Order::with('user')->get();
    }
    public function getOrderID($id){
        $order=Order::with('user')->findOrFail($id);
        return response()->json($order);
    }

     public function createOrder(Request $request) {
        $validator = Validator::make($request->all(), [
            'userID' => 'nullable|exists:users,id',
            'total_price' => 'required|numeric',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|max:255',
            'status' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $order = Order::create([
            'userID ' => $request->get('userID '),
            'total_price' => $request->get('total_price'),
            'shipping_address' => $request->get('shipping_address'),
            'payment_method' => $request->get('payment_method'),
            'status' => $request->get('status'),
        ]);

        return response()->json($order, 201);
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
}
