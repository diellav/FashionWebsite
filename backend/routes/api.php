<?php
//krejt routes po vendosen ne kete file
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Product_VariantsController;


Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);


Route::middleware('auth:api')->group(function(){
    Route::get('/me',[AuthController::class,'me']);
    Route::get('/logout',[AuthController::class,'logout']);

    //users:
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/users/{id}', [UserController::class, 'getUserID']);
    Route::post('/users', [UserController::class, 'createUser']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);

    //categories
    Route::get('/categories', [CategoryController::class, 'getCategorys']);
    Route::get('/categories/{id}', [CategoryController::class, 'getCategoryID']);
    Route::post('/categories', [CategoryController::class, 'createCategory']);
    Route::put('/categories/{id}', [CategoryController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [CategoryController::class, 'deleteCategory']);

     //products
    Route::get('/products', [ProductController::class, 'getProducts']);
    Route::get('/products/{id}', [ProductController::class, 'getProductID']);
    Route::post('/products', [ProductController::class, 'createProduct']);
    Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
         
    //product_variants
    Route::get('/product_variants', [Product_VariantsController::class, 'getProductVariants']);
    Route::get('/product_variants/{id}', [Product_VariantsController::class, 'getProductVariantID']);
    Route::post('/product_variants', [Product_VariantsController::class, 'createProductVariant']);
    Route::put('/product_variants/{id}', [Product_VariantsController::class, 'updateProductVariant']);
    Route::delete('/product_variants/{id}', [Product_VariantsController::class, 'deleteProductVariant']);
});
 

