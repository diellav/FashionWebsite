<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function getProducts(){
        return Product::with(['category', 'discounts', 'variants'])->get();
    }
    public function getProductID($id){
        $product=Product::with(['category', 'discounts', 'variants'])->findOrFail($id);
        return response()->json($product);
    }

     public function createProduct(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'categoryID' => 'nullable|exists:categories,id',
            'stock' => 'required|numeric',
            'main_image' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $product = Product::create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'price' => $request->get('price'),
            'categoryID' => $request->get('categoryID'),
            'stock' => $request->get('stock'),
            'main_image' => $request->get('main_image'),
        ]);

        $product->hasdiscount = $product->discounts()->exists() ? 1 : 0;
        $product->has_variants = $product->variants()->exists() ? 1 : 0;
        $product->save();
        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, $id) {
        $product = Product::findOrFail($id);

        $product->update($request->only([
            'name', 'description', 'price', 'categoryID', 'stock',
            'main_image'
        ]));

        return response()->json($product);
    }
    public function deleteProduct($id) {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function getRecentProducts(){
        $week=Carbon::now()->subDays(7);
        $recent=Product::with(['category','discounts','variants'])
        ->where('created_at','>=', $week)->orderBy('created_at','desc')->get();
        return response()->json($recent);
    }

}
