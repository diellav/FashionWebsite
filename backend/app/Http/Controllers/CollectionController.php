<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class CollectionController extends Controller
{
    public function getCollections(Request $request) {
        $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query =  Collection::with('products');
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhere('name', 'like', "%$search%")
              ->orWhere('description', 'like', "%$search%")
              ->orWhere('image', 'like', "%$search%")
              ->orWhere('start_date', 'like', "%$search%")
              ->orWhere('end_date', 'like', "%$search%");
        });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);
     
    return response()->json($users);
    }

    public function getCollectionID($id) {
        $collection = Collection::with('products')->findOrFail($id);
        return response()->json($collection);
    }

    public function createCollection(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
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
        $collection = Collection::create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'image' => $imagePath,
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
        ]);

        if ($request->filled('productIDs')) {
            $collection->products()->sync($request->input('productIDs', []));
        }

        return response()->json($collection->load('products'), 201);
    }

  public function updateCollection(Request $request, $id) {
    $collection = Collection::with('products')->findOrFail($id);

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,webp|max:2048',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
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
        $updateData = $request->only(['name', 'description', 'start_date', 'end_date']);

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
            'error' => 'Failed to update collection',
            'message' => $e->getMessage()
        ], 500);
    }
}
 
    public function deleteCollection($id) {
        $collection = Collection::with('products')->findOrFail($id);
        $collection->delete();
        return response()->json(['message' => 'Collection deleted successfully']);
    }

    public function getCollectionHome() {
        return Collection::with('products')->orderByDesc('created_at')->first();
    }

}
