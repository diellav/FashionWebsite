<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product_Variants;
use Illuminate\Support\Facades\Validator;

class Product_VariantsController extends Controller
{
    public function getProductVariants(){
        return Product_Variants::with('product', 'images')->get();
    }
    public function getProductVariantID($id){
        $product_variant=Product_Variants::with('product', 'images')->findOrFail($id);
        return response()->json($product_variant);
    }

     public function createProductVariant(Request $request) {
        $validator = Validator::make($request->all(), [
            'productID' => 'nullable|exists:products,id',
            'color' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $product_variant = Product_Variants::create([
            'productID' => $request->get('productID'),
            'color' => $request->get('color'),
            'material' => $request->get('material'),
            'image' => $request->get('image'),
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
