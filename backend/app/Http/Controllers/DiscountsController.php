<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discounts;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class DiscountsController extends Controller
{
     public function getDiscounts(Request $request){
       $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query =  Discounts::with('products');
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhere('name', 'like', "%$search%")
              ->orWhere('value', 'like', "%$search%")
              ->orWhere('type', 'like', "%$search%")
              ->orWhere('conditions', 'like', "%$search%")
              ->orWhere('start_date', 'like', "%$search%")
              ->orWhere('end_date', 'like', "%$search%")
              ->orWhere('image', 'like', "%$search%");
        });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);
     
    return response()->json($users);
    }
    public function getDiscountID($id){
        $discount=Discounts::with('products')->findOrFail($id);
        return response()->json($discount);
    }

     public function createDiscount(Request $request) {
         $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'value' => 'nullable|numeric',
            'type' => 'nullable|string|max:255',
            'conditions' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'image' => 'nullable|image',
            'productIDs' => 'nullable|array',
            'productIDs.*' => 'exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
          $imagePath = null;

   if ($request->hasFile('image')) {
        $imageFile = $request->file('image');
        $imageName =$imageFile->getClientOriginalName();
        $imagePath = '/images/'.$imageName;
        $imageFile->move(public_path('images'), $imageName);
    }
        $collection = Discounts::create([
            'name' => $request->get('name'),
            'value' => $request->get('value'),
            'type' => $request->get('type'),
            'conditions' => $request->get('conditions'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'image' => $imagePath,
        ]);

        if ($request->filled('productIDs')) {
            $collection->products()->sync($request->input('productIDs', []));
        }

        return response()->json($collection->load('products'), 201);
    }

  public function updateDiscount(Request $request, $id) {
    $collection = Discounts::with('products')->findOrFail($id);

    $validator = Validator::make($request->all(), [
         'name' => 'required|string|max:255',
            'value' => 'nullable|numeric',
            'type' => 'nullable|string|max:255',
            'conditions' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|after:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,webp|max:2048',
            'productIDs' => 'nullable|array',
            'productIDs.*' => 'exists:products,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 400);
    }

    DB::beginTransaction();
    try {
        $updateData = $request->only(['name', 'value','type','conditions' ,'start_date', 'end_date']);

        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageName = $imageFile->getClientOriginalName();
            $imagePath = '/images/'.$imageName;
            $imageFile->move(public_path('images'), $imageName);
            if ($collection->image && file_exists(public_path($collection->image))) {
                unlink(public_path($collection->image));
            }
            
            $updateData['image'] = $imagePath;
        }

        $collection->update($updateData);
        $collection->products()->sync($request->input('productIDs', []));

        DB::commit();
        return response()->json($collection->load('products'), 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Failed to update discount',
            'message' => $e->getMessage()
        ], 500);
    }
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
