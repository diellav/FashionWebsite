<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;


class CategoryController extends Controller
{

        public function getCategorysNavbar(){
        $categories = Category::with(['parent','children'])->get();
    return response()->json($categories);
        }

    public function getCategorys(Request $request){
         $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'name');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query =  Category::with(['parent','children']);
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%$search%")
              ->orWhere('description', 'like', "%$search%")
              ->orWhere('image', 'like', "%$search%")
              ->orWhere('parentID', 'like', "%$search%");
        });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }
    public function getCategoryID($id){
        $category=Category::with(['parent','children'])->findOrFail($id);
        return response()->json($category);
    }

     public function createCategory(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string|max:255',
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
