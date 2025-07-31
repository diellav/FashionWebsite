<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sizes;

class SizesController extends Controller
{
     public function getSizes(){
        return Sizes::with('product', 'variant')->get();
    }
    public function getSizeID($id){
        $size=Sizes::with('product', 'variant')->findOrFail($id);
        return response()->json($size);
    }

     public function createSize(Request $request) {
        $validator = Validator::make($request->all(), [
            'productID' => 'nullable|exists:products,id',
            'variantID' => 'nullable|exists:product_variants,id',
            'size' => 'nullable|string|max:255',
            'stock' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $size = Sizes::create([
            'productID' => $request->get('productID'),
            'variantID' => $request->get('variantID'),
            'size' => $request->get('size'),
            'stock' => $request->get('stock')
        ]);

        return response()->json($size, 201);
    }

    public function updateSize(Request $request, $id) {
        $size = Sizes::findOrFail($id);

        $size->update($request->only([
            'productID', 'variantID','size','stock'
        ]));

        return response()->json($size);
    }
    public function deleteSize($id) {
        $size = Sizes::findOrFail($id);
        $size->delete();
        return response()->json(['message' => 'Size deleted successfully']);
    }
}
