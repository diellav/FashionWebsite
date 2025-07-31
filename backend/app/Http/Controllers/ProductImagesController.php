<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductImages;
use Illuminate\Http\Request;

class ProductImagesController extends Controller
{
     public function getAllImages()
    {
        return ProductImages::with(['product', 'variant'])->get();
    }

    public function getImageById($id)
    {
        $image = ProductImages::with(['product', 'variant'])->findOrFail($id);
        return response()->json($image);
    }

    public function createProductImages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'images' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if (
            (!$request->product_id && !$request->variant_id) ||
            ($request->product_id && $request->variant_id)
        ) {
            return response()->json([
                'error' => 'Please choose product or product variant, not both!'
            ], 400);
        }

        $image = ProductImages::create([
            'product_id' => $request->get('product_id'),
            'variant_id' => $request->get('variant_id'),
            'images' => $request->get('image_path'),
        ]);

        return response()->json($image, 201);
    }

    public function updateProductImages(Request $request, $id)
    {
        $image = ProductImages::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'images' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if (
            (!$request->product_id && !$request->variant_id) ||
            ($request->product_id && $request->variant_id)
        ) {
            return response()->json([
                'error' => 'Please choose product or product variant, not both!'
            ], 400);
        }

        $image->update($request->only(['product_id', 'variant_id', 'images']));

        return response()->json($image);
    }

    public function deleteProductImages($id)
    {
        $image = ProductImages::findOrFail($id);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
