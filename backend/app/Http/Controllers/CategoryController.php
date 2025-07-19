<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;


class CategoryController extends Controller
{
    public function getCategorys(){
        return Category::with(['parent','children'])->get();
    }
    public function getCategoryID($id){
        $category=Category::with(['parent','children'])->findOrFail($id);
        return response()->json($category);
    }

     public function createCategory(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|string|max:255',
            'parentID' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $category = Category::create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'image' => $request->get('image'),
            'parentID' => $request->get('parentID'),
        ]);

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id) {
        $category = Category::findOrFail($id);

        $category->update($request->only([
            'name', 'description', 'image', 'parentID'
        ]));

        return response()->json($category);
    }
    public function deleteCategory($id) {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

}
