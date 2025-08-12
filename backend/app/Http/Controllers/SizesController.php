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
    public function getSizesDashboard(Request $request){
         $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = Sizes::query();
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhereHas('product', function($q2) use ($search) {
                $q2->where('name', 'like', "%$search%");
              })->orWhereHas('variant', function($q3) use ($search) {
                $q3->where('color', 'like', "%$search%");
              })
              ->orWhere('size', 'like', "%$search%")
              ->orWhere('stock', 'like', "%$search%");
            });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }
    public function getSizeID($id){
        $size=Sizes::with('product', 'variant')->findOrFail($id);
        return response()->json($size);
    }

     public function createSize(Request $request) {
        $validator = Validator::make($request->all(), [
              'productID' => 'nullable|exists:products,id',
        'variantID' => 'nullable|exists:product_variants,id',
        'sizes' => 'required|array',
        'sizes.*.size' => 'required|string|max:255',
        'sizes.*.stock' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $sizesCreated = [];
    foreach ($request->input('sizes') as $sizeData) {
        $size = Sizes::create([
            'productID' => $request->input('productID'),
            'variantID' => $request->input('variantID'),
            'size' => $sizeData['size'],
            'stock' => $sizeData['stock'],
        ]);
        $sizesCreated[] = $size;
    }

    return response()->json($sizesCreated, 201);
}

    public function updateSize(Request $request, $id) {
          $size = Sizes::findOrFail($id);

    $sizesArray = $request->input('sizes', []);
    if (!empty($sizesArray) && isset($sizesArray[0])) {
        $size->size = $sizesArray[0]['size'] ?? $size->size;
        $size->stock = $sizesArray[0]['stock'] ?? $size->stock;
    }

    $size->productID = $request->productID ?? $size->productID;
    $size->variantID = $request->variantID ?? $size->variantID;
    $size->save();

        return response()->json($size);
    }
    public function deleteSize($id) {
        $size = Sizes::findOrFail($id);
        $size->delete();
        return response()->json(['message' => 'Size deleted successfully']);
    }
}
