<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product_Variants;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class Product_VariantsController extends Controller
{
    public function getProductVariants(Request $request){
         $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query =  Product_Variants::with(['product', 'images']);
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhere('color', 'like', "%$search%")
              ->orWhere('material', 'like', "%$search%")
              ->orWhere('image', 'like', "%$search%")
              ->orWhere('productID', 'like', "%$search%");
        });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    
    }
    public function getProductVariantID($id){
        $product_variant=Product_Variants::with('product', 'images')->findOrFail($id);
        return response()->json($product_variant);
    }

    public function createProductVariant(Request $request) {
    $validator = Validator::make($request->all(), [
        'productID' => 'required|exists:products,id',
        'color' => 'required|string|max:255',
        'material' => 'required|string|max:255',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }
$imagePath = null;
$imageFile = null;
$imageName = null;
 if ($request->hasFile('image')) {
        $imageFile = $request->file('image');
        $imageName = $imageFile->getClientOriginalName();
        $imagePath = '/images/Shop/' . $imageName;
        $imageFile->storeAs('images/Shop', $imageName, 'public');
    }

    $product_variant = Product_Variants::create([
        'productID' => $request->get('productID'),
        'color' => $request->get('color'),
        'material' => $request->get('material'),
        'image' => $imagePath,
    ]);

    return response()->json($product_variant, 201);
}


    public function updateProductVariant(Request $request, $id) {
        $product_variant = Product_Variants::findOrFail($id);

        $product_variant->update($request->only([
            'productID', 'color', 'material','image'
        ]));

        return response()->json($product_variant);
    }
    public function deleteProductVariant($id) {
        $product_variant = Product_Variants::findOrFail($id);
        $product_variant->delete();
        return response()->json(['message' => 'ProductVariant deleted successfully']);
    }

}
