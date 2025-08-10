<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductImages;
use App\Models\Product;
use App\Models\Product_Variants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class ProductImagesController extends Controller
{
     public function getAllImages(Request $request)
    {
          $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query =  ProductImages::with(['product', 'variant']);
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhere('images', 'like', "%$search%")
              ->orWhereHas('product', function($q2) use ($search) {
                  $q2->where('name', 'like', "%$search%");
        })
        ->orWhereHas('variant', function($q2) use ($search) {
                  $q2->where('color', 'like', "%$search%");
        });});
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }

    public function getImageById($id)
    {
        $image = ProductImages::with(['product', 'variant'])->findOrFail($id);
        return response()->json($image);
    }

    public function createProductImages(Request $request)
    {
       $validator = Validator::make($request->all(), [
        'productID' => 'nullable|exists:products,id',
        'variantID' => 'nullable|exists:product_variants,id',
        'images.*' => 'image',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    DB::beginTransaction();
    try {    
         if ($request->filled('variantID')) {
            $model = Product_Variants::findOrFail($request->variantID);
        } elseif ($request->filled('productID')) {
            $model = Product::findOrFail($request->productID);
        } else {
            return response()->json(['error' => 'Duhet të japësh productID ose variantID'], 400);
        }
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
              $imageName = $imageFile->getClientOriginalName();
                 $imagePath = '/images/Shop/' . $imageName;
                  $imageFile->storeAs('images/Shop', $imageName, 'public');
                $model->images()->create(['images' => $imagePath]);
            }
        }
          ProductImages::create([
                    'productID' => $request->productID,
                    'variantID' => $request->variantID,
                    'images'    => $imagePath
                ]);
        DB::commit();
        return response()->json($model->load('images'),201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to create product', 'message' => $e->getMessage()], 500);
    }
}
    public function updateProductImages(Request $request, $id)
    {


     $product = ProductImages::findOrFail($id);

    $validator = Validator::make($request->all(), [
        'productID' => 'nullable|exists:products,id',
        'variantID' => 'nullable|exists:product_variants,id',
        'images.*' => 'image',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    DB::beginTransaction();
    try {
        $product->update($request->only(['productID', 'variantID']));
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $imageName = $imageFile->getClientOriginalName();
                $imagePath = '/images/Shop/' . $imageName;
                $imageFile->storeAs('images/Shop', $imageName, 'public');
                  ProductImages::create([
                    'productID' => $request->productID ?? $product->productID,
                    'variantID' => $request->variantID ?? $product->variantID,
                    'images'    => $imagePath
                ]);
            }
        }
        DB::commit();
        return response()->json($product, 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Failed to update product',
            'message' => $e->getMessage()
        ], 500);
    }
}

    public function deleteProductImages($id)
    {
        $image = ProductImages::findOrFail($id);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
