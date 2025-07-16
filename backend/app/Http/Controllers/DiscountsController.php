<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discounts;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DiscountsController extends Controller
{
     public function getDiscounts(){
        return Discounts::with('products')->get();
    }
    public function getDiscountID($id){
        $discount=Discounts::with('products')->findOrFail($id);
        return response()->json($discount);
    }

     public function createDiscount(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        'value' => 'required|numeric',
        'type' => 'required|string|in:fixed,percentage',
        'conditions' => 'required|string|max:255',
        'productIDs' => 'nullable|array', 
        'productIDs.*' => 'exists:products,id',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $discount = Discounts::create([
            'name' => $request->get('name'),
            'value' => $request->get('value'),
            'type' => $request->get('type'),
            'conditions' => $request->get('conditions'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
        ]);
if ($request->has('productIDs')) {
        $discount->products()->attach($request->get('productIDs'));
    }
        return response()->json($discount->load('products'), 201);
    }

    public function updateDiscount(Request $request, $id) {
        $discount = Discounts::findOrFail($id);

        $discount->update($request->only([
            'name','value', 'type', 'conditions','start_date','end_date'
        ]));
if ($request->has('productIDs')) {
    $discount->products()->sync($request->get('productIDs'));
}
        return response()->json($discount);
    }
    public function deleteDiscount($id) {
        $discount = Discounts::findOrFail($id);
        $discount->delete();
        return response()->json(['message' => 'Discount deleted successfully']);
    }

public function getDealsOfTheWeek() {
    $today = Carbon::today();
    $discounts = Discounts::with('products')
                  ->where('start_date', '<=', $today)
                  ->where('end_date', '>=', $today)
                  ->get();

    return response()->json($discounts);

}

}
