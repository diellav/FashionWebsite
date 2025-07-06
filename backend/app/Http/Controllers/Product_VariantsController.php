<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product_Variants;

class Product_VariantsController extends Controller
{
    public function getProductVariants(){
        return Product_Variants::with('product')->get();
    }
    public function getProductVariantID($id){
        $product_variant=Product_Variants::with('product')->findOrFail($id);
        return response()->json($product_variant);
    }

     public function createProductVariant(Request $request) {
        $validator = Validator::make($request->all(), [
            'productID' => 'nullable|exists:products,id',
            'size' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'stock' => 'required|numeric',
            'image' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $product_variant = Product_Variants::create([
            'productID' => $request->get('productID'),
            'size' => $request->get('size'),
            'color' => $request->get('color'),
            'material' => $request->get('material'),
            'price' => $request->get('price'),
            'stock' => $request->get('stock'),
            'image' => $request->get('image'),
        ]);

        return response()->json($product_variant, 201);
    }

    public function updateProductVariant(Request $request, $id) {
        $product_variant = Product_Variants::findOrFail($id);

        $product_variant->update($request->only([
            'productID', 'size', 'color', 'material', 'price',
            'stock','image'
        ]));

        return response()->json($product_variant);
    }
    public function deleteProductVariant($id) {
        $product_variant = Product_Variants::findOrFail($id);
        $product_variant->delete();
        return response()->json(['message' => 'ProductVariant deleted successfully']);
    }

}
