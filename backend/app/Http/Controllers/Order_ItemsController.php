<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order_Items;

class Order_ItemsController extends Controller
{
     public function getOrderItems(){
        return Order_Items::with(['order','product','product_variant'])->get();
    }
    public function getOrderItemsID($id){
        $order_items=Order_Items::with(['order','product','product_variant'])->findOrFail($id);
        return response()->json($order_items);
    }

     public function createOrderItems(Request $request) {
        $validator = Validator::make($request->all(), [
            'orderID' => 'required|exists:orders,id',
            'productID' => 'required|exists:products,id',
            'product_variantID' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $order_items = Order_Items::create([
            'orderID ' => $request->get('orderID '),
            'productID ' => $request->get('productID '),
            'product_variantID ' => $request->get('product_variantID '),
            'quantity' => $request->get('quantity'),
            'price' => $request->get('shipping_address'),
        ]);

        return response()->json($order_items, 201);
    }

    public function updateOrderItems(Request $request, $id) {
        $order_items = Order_Items::findOrFail($id);

        $order_items->update($request->only([
            'orderID','productID', 'product_variantID', 'quantity', 'price'
        ]));

        return response()->json($order_items);
    }
    public function deleteOrderItems($id) {
        $order_items = Order_Items::findOrFail($id);
        $order_items->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
