<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductController extends Controller
{

      public function getProducts(){
        return Product::with(['category', 'discounts', 'variants'])->get();
      }

    public function getProductsFilter(Request $request){
        $query=Product::with(['category', 'discounts', 'variants']);


        //per ndarjen ne navbar:
        if($request->has('category')){
            $categoryName=strtolower($request->get('category'));

            $parent=DB::table('categories')->whereRaw('LOWER(name)=?', [$categoryName])->first();
            if($parent){
                if($request->has('subcategory')){
                    $subcategoryName=strtolower($request->get('subcategory'));
                    $subcategory=DB::table('categories')->whereRaw('LOWER(name)=?', [$subcategoryName])->where('parentID', $parent->id)->first();

                    if($subcategory){
                         $categoryIDs=collect([$subcategory->id]);
                    }else{
                        $categoryIDs = DB::table('categories')->where('parentID', $parent->id)->pluck('id');
                    }
                }else{
                    $categoryIDs = DB::table('categories')->where('parentID', $parent->id)->pluck('id');
                }
                
            if($categoryIDs->isEmpty()){
                $categoryIDs=collect([$parent->id]);
            }
            $query->whereIn('categoryID', $categoryIDs);
            }
        }

        if($request->has('priceRange')){
            $range=$request->get('priceRange');
            if(is_array($range) && count($range)===2){
                $query->whereBetween('price', [$range[0], $range[1]]);
            }
        }
        if($request->has('categories')&& is_array($request->categories) && count($request->categories)>0){
            $query->whereIn('categoryID',$request->categories );
        }

         if($request->has('sizes')&& is_array($request->sizes) && count($request->sizes)>0){
            $query->whereHas('variants', function($sz)use($request){
                $sz->whereIn('size', $request->sizes);
            });
        }

        switch ($request->get('sortOption')) {
        case 'price-asc':
            $query->orderBy('price', 'asc');
            break;
        case 'price-desc':
            $query->orderBy('price', 'desc');
            break;
        case 'newest':
            $query->orderBy('created_at', 'desc');
            break;
        default:
            $query->orderBy('created_at', 'desc');
            break;
        }

        $limit = $request->get('limit', 20);
        $page = $request->get('page', 1);
        $paginated = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
        'products' => $paginated->items(),
        'totalPages' => $paginated->lastPage(),
        'currentPage' => $paginated->currentPage(),
        'totalItems' => $paginated->total(),
]);
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
        ->where('created_at','>=', $week)->orderBy('created_at','desc')->limit(10)->get();
        return response()->json($recent);
    }

    public function getBestSellers(){
        $products=DB::table('order_items')
        ->select('products.*',DB::raw('SUM(order_items.quantity) as total_sold'))
        ->join('product_variants', 'product_variants.id', '=', 'order_items.product_variantID')
        ->join('products', 'product_variants.productID', '=', 'products.id')
        ->groupBy('products.id')
        ->orderByDesc('total_sold')->limit(12)->get();
        return response()->json($products);
    }

}
