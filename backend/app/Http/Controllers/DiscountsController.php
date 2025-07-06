<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discounts;

class DiscountsController extends Controller
{
     public function getDiscounts(){
        return Discount::with('products')->get();
    }
    public function getDiscountID($id){
        $discount=Discount::with('products')->findOrFail($id);
        return response()->json($discount);
    }

     public function createDiscount(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'type' => 'required||string|in:fixed,percentage',
            'conditions' => 'required|string|max:255',
            'productID' => 'nullable|exists:products,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $discount = Discount::create([
            'name' => $request->get('name'),
            'value' => $request->get('value'),
            'type' => $request->get('type'),
            'conditions' => $request->get('conditions'),
            'productID' => $request->get('productID'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
        ]);

        return response()->json($discount, 201);
    }

    public function updateDiscount(Request $request, $id) {
        $discount = Discount::findOrFail($id);

        $discount->update($request->only([
            'name','value', 'type', 'conditions', 'productID','start_date','end_date'
        ]));

        return response()->json($discount);
    }
    public function deleteDiscount($id) {
        $discount = Discount::findOrFail($id);
        $discount->delete();
        return response()->json(['message' => 'Discount deleted successfully']);
    }
}
