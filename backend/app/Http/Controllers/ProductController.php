<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{

      public function getProducts(Request $request){
         $limit = $request->query('limit', 10);
            $page = $request->query('page', 1);
            $sort = $request->query('sort', 'id');
            $order = $request->query('order', 'asc');
            $search = $request->query('search', '');

            $query = Product::with(['category', 'discounts', 'variants', 'images', 'collections']);
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%$search%")
                    ->orWhere('name', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    });
                });
            }
            $query->orderBy($sort, $order);
            $products = $query->paginate($limit, ['*'], 'page', $page);

        $products->getCollection()->transform(function ($product) {
        $product->discounted_price = $product->discounted_price;
        return $product;
    });
       
          return response()->json($products);
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
    $query = Product::with(['category', 'discounts', 'variants', 'images', 'collections']);

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
        if ($request->has('collection') && $request->boolean('collection')) {
            $now = now();
            $query->whereHas('collections', function ($q) use ($now) {
             $q->where('collections.start_date', '<=', $now)->where('collections.end_date', '>=', $now);
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
    'variants.sizeStocks', 'collections' ])->findOrFail($id);
    $product->discounted_price=$product->discounted_price;
        $averageRating = DB::table('reviews')
            ->where('productID', $product->id)
            ->avg('rating');
        
        $product->average_rating = round($averageRating, 1) ?? 0;
        return response()->json($product);
    }

  public function createProduct(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'categoryID' => 'nullable|exists:categories,id',
        'main_image' => 'nullable|image',
        'images.*' => 'image',
        'variants' => 'sometimes|array',
        'variants.*.color' => 'nullable|string|max:255',
        'variants.*.material' => 'nullable|string|max:255',
        'variants.*.images.*' => 'image',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    DB::beginTransaction();
    try {
        $mainImageName = $request->file('main_image')->getClientOriginalName();
        $mainImagePath = '/images/Shop/' . $mainImageName;
        $request->file('main_image')->storeAs('images/Shop', $mainImageName, 'public');
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'categoryID' => $request->categoryID,
            'main_image' => $mainImagePath,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                 $imageName = $imageFile->getClientOriginalName();
                 $imagePath = '/images/Shop/' . $imageName;
                  $imageFile->storeAs('images/Shop', $imageName, 'public');
                $product->images()->create(['images' => $imagePath]);
            }
        }
        if ($request->has('variants')) {
            foreach ($request->variants as $i => $variantData) {
                $variant = $product->variants()->create([
                    'color' => $variantData['color'] ?? null,
                    'material' => $variantData['material'] ?? null,
                ]);

                if ($request->hasFile("variants.$i.images")) {
                    foreach ($request->file("variants.$i.images") as $variantImage) {
                         $variantImageName = $variantImage->getClientOriginalName();
                        $variantImagePath = '/images/Shop/variants/' . $variantImageName;
                        $variantImage->storeAs('images/Shop/variants', $variantImageName, 'public');
                        $variant->images()->create(['images' => $variantImagePath]);
                    }
                }
            }
        }

        DB::commit();
        return response()->json($product->load('variants.images', 'images'), 201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to create product', 'message' => $e->getMessage()], 500);
    }
}

   public function updateProduct(Request $request, $id)
{
    $product = Product::with('variants.images', 'images')->findOrFail($id);

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'categoryID' => 'nullable|exists:categories,id',
        'main_image' => 'nullable|image',
        'images.*' => 'image',
        'variants' => 'sometimes|array',
        'variants.*.color' => 'nullable|string|max:255',
        'variants.*.material' => 'nullable|string|max:255',
        'variants.*.images.*' => 'image',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    DB::beginTransaction();
    try {
        $product->update($request->only(['name', 'description', 'price', 'categoryID']));
        if ($request->hasFile('main_image')) {
            $mainImageName = $request->file('main_image')->getClientOriginalName();
            $mainImagePath = '/images/Shop/' . $mainImageName;
            $request->file('main_image')->storeAs('images/Shop', $mainImageName, 'public');
            $product->update(['main_image' => $mainImagePath]);
        }
        if ($request->hasFile('images')) {
        
            foreach ($request->file('images') as $imageFile) {
                $imageName = $imageFile->getClientOriginalName();
                $imagePath = '/images/Shop/' . $imageName;
                $imageFile->storeAs('images/Shop', $imageName, 'public');
                $product->images()->create(['images' => $imagePath]);
            }
        }

        if ($request->has('variants')) {
            foreach ($request->variants as $i => $variantData) {
                $variant = $product->variants()->create([
                    'color' => $variantData['color'] ?? null,
                    'material' => $variantData['material'] ?? null,
                ]);

                if ($request->hasFile("variants.$i.images")) {
                    foreach ($request->file("variants.$i.images") as $variantImage) {
                        $variantImageName = $variantImage->getClientOriginalName();
                        $variantImagePath = '/images/Shop/variants/' . $variantImageName;
                        $variantImage->storeAs('images/Shop/variants', $variantImageName, 'public');
                        $variant->images()->create(['images' => $variantImagePath]);
                    }
                }
            }
        }

        DB::commit();
        return response()->json($product->load('variants.images', 'images'), 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Failed to update product',
            'message' => $e->getMessage()
        ], 500);
    }
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
public function getCollectionProducts(Request $request)
{
    return $this->createPaginatedFilteredProducts($request, function ($query) {
        $now = now();
        $query->whereHas('collections', function ($q) use ($now) {
             $q->where('collections.start_date', '<=', $now)->where('collections.end_date', '>=', $now);
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
