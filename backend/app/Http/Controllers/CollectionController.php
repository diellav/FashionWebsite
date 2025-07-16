<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collection;
use Illuminate\Support\Facades\Validator;

class CollectionController extends Controller
{
    public function getCollections() {
        return Collection::with('products')->get();
    }

    public function getCollectionID($id) {
        $collection = Collection::with('products')->findOrFail($id);
        return response()->json($collection);
    }

    public function createCollection(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:255',
            'productIDs' => 'nullable|array',
            'productIDs.*' => 'exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $collection = Collection::create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'image' => $request->get('image'),
        ]);

        if ($request->has('productIDs')) {
            $collection->products()->attach($request->get('productIDs'));
        }

        return response()->json($collection->load('products'), 201);
    }

    public function updateCollection(Request $request, $id) {
        $collection = Collection::findOrFail($id);

        $collection->update($request->only([
            'name', 'description', 'image'
        ]));

        if ($request->has('productIDs')) {
            $collection->products()->sync($request->get('productIDs'));
        }

        return response()->json($collection->load('products'));
    }

    public function deleteCollection($id) {
        $collection = Collection::findOrFail($id);
        $collection->delete();
        return response()->json(['message' => 'Collection deleted successfully']);
    }

    public function getCollectionHome() {
        return Collection::with('products')->orderByDesc('created_at')->first();
    }

}
