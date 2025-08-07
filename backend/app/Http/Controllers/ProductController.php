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
        $products=Product::with(['category', 'discounts', 'variants', 'images'])->get();
        $products->each(function($product){
            $product->discounted_price=$product->discounted_price;
        });
        return $products;
      }
private function createPaginatedFilteredProducts(Request $request, ?callable $extraQuery = null)
{
    $query = $this->filterProductsBaseQuery($request);

    if ($extraQuery) {
        $extraQuery($query);
    }

    switch ($request->get('sortOption')) {
        case 'price-asc':
            $query->orderBy('price', 'asc');
            break;
        case 'price-desc':
            $query->orderBy('price', 'desc');
            break;
        case 'newest':
        default:
            $query->orderBy('created_at', 'desc');
            break;
    }

    $limit = $request->get('limit', 20);
    $page = $request->get('page', 1);

    $paginated = $query->paginate($limit, ['*'], 'page', $page);

    $productsWithPrices = $paginated->getCollection()->map(function ($product) {
        $product->discounted_price = $product->discounted_price;
        return $product;
    });

    return response()->json([
        'products' => $productsWithPrices,
        'totalPages' => $paginated->lastPage(),
        'currentPage' => $paginated->currentPage(),
        'totalItems' => $paginated->total(),
    ]);
}
private function filterProductsBaseQuery(Request $request)
{
    $query = Product::with(['category', 'discounts', 'variants', 'images']);

    if ($request->has('category')) {
        $categoryName = strtolower($request->get('category'));

        $parent = DB::table('categories')->whereRaw('LOWER(name)=?', [$categoryName])->first();

        if ($parent) {
            if ($request->has('subcategory')) {
                $subcategoryName = strtolower($request->get('subcategory'));
                $subcategory = DB::table('categories')
                    ->whereRaw('LOWER(name)=?', [$subcategoryName])
                    ->where('parentID', $parent->id)
                    ->first();

                if ($subcategory) {
                    $categoryIDs = collect([$subcategory->id]);
                } else {
                    $categoryIDs = DB::table('categories')->where('parentID', $parent->id)->pluck('id');
                }
            } else {
                $categoryIDs = DB::table('categories')->where('parentID', $parent->id)->pluck('id');
            }

            if ($categoryIDs->isEmpty()) {
                $categoryIDs = collect([$parent->id]);
            }

            $query->whereIn('categoryID', $categoryIDs);
        }
    }

    if ($request->has('priceRange')) {
        $range = $request->get('priceRange');
        if (is_array($range) && count($range) === 2) {
            $query->whereBetween('price', [$range[0], $range[1]]);
        }
    }

    if ($request->has('categories') && is_array($request->categories) && count($request->categories) > 0) {
        $query->whereIn('categoryID', $request->categories);
    }

    if ($request->has('sizes')) {
        $query->whereHas('sizeStocks', function ($q) use ($request) {
            $q->whereIn('size', $request->sizes);
        });
    }

    return $query;
}


   public function getProductsFilter(Request $request)
{
    return $this->createPaginatedFilteredProducts($request, function ($query) use ($request) {
        if ($request->has('recent') && $request->boolean('recent')) {
            $query->where('created_at', '>=', now()->subDays(14));
        }

        if ($request->has('sale') && $request->boolean('sale')) {
            $now = now();
            $query->whereHas('discounts', function ($q) use ($now) {
                $q->where('start_date', '<=', $now)->where('end_date', '>=', $now);
            });
        }
    });
}

    public function getProductID($id){
        $product=Product::with([ 'category',
    'discounts',
    'variants.images',
    'images',
    'sizestocks',
    'variants.sizeStocks' ])->findOrFail($id);
    $product->discounted_price=$product->discounted_price;
        $averageRating = DB::table('reviews')
            ->where('productID', $product->id)
            ->avg('rating');
        
        $product->average_rating = round($averageRating, 1) ?? 0;
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

    public function getRecentProducts(Request $request)
{
    return $this->createPaginatedFilteredProducts($request, function ($query) {
        $query->where('created_at', '>=', now()->subDays(14));
    });
}
public function getSaleProducts(Request $request)
{
    return $this->createPaginatedFilteredProducts($request, function ($query) {
        $now = now();
        $query->whereHas('discounts', function ($q) use ($now) {
            $q->where('start_date', '<=', $now)->where('end_date', '>=', $now);
        });
    });
}


   public function getBestSellers() {
    $products = DB::table('order_items')
        ->select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
        ->leftJoin('product_variants', 'product_variants.id', '=', 'order_items.product_variantID')
        ->join('products', function ($join) {
            $join->on('products.id', '=', DB::raw('COALESCE(product_variants.productID, order_items.productID)'));
        })
        ->groupBy('products.id')
        ->orderByDesc('total_sold')
        ->limit(12)
        ->get();
        
    return response()->json($products);
}

   public function getSimilarProducts($id){
    $product = Product::with('images')->findOrFail($id);

    $keywords = collect(explode(' ', $product->name . ' ' . $product->description))
        ->filter(function ($word) {
            return strlen($word) > 3;
        })->unique();

    $query = Product::with('images')
        ->where('id', '!=', $id)
        ->where(function ($q) use ($keywords) {
            foreach ($keywords as $word) {
                $q->orWhere('name', 'like', '%' . $word . '%')
                  ->orWhere('description', 'like', '%' . $word . '%');
            }
        });

    $similarProducts = $query->limit(10)->get();

    return response()->json($similarProducts);
}



}
