<?php
//krejt routes po vendosen ne kete file
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Product_VariantsController;
use App\Http\Controllers\DiscountsController;
use App\Http\Controllers\Cart_ItemsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Order_ItemsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;


Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);
    // routes/api.php
    Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('/password/reset', [ResetPasswordController::class, 'reset']);
    

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

      //discounts
    Route::get('/discounts', [DiscountsController::class, 'getDiscounts']);
    Route::get('/discounts/{id}', [DiscountsController::class, 'getDiscountID']);
    Route::post('/discounts', [DiscountsController::class, 'createDiscount']);
    Route::put('/discounts/{id}', [DiscountsController::class, 'updateDiscount']);
    Route::delete('/discounts/{id}', [DiscountsController::class, 'deleteDiscount']);

    //cart_items
    Route::get('/cart_items', [Cart_ItemsController::class, 'getCart_Items']);
    Route::get('/cart_items/{id}', [Cart_ItemsController::class, 'getCart_ItemID']);
    Route::post('/cart_items', [Cart_ItemsController::class, 'createCart_Item']);
    Route::put('/cart_items/{id}', [Cart_ItemsController::class, 'updateCart_Item']);
    Route::delete('/cart_items/{id}', [Cart_ItemsController::class, 'deleteCart_Item']);

    //cart_items
    Route::get('/cart', [CartController::class, 'getCarts']);
    Route::get('/cart/{id}', [CartController::class, 'getCartID']);
    Route::post('/cart', [CartController::class, 'createCart']);
    Route::put('/cart/{id}', [CartController::class, 'updateCart']);
    Route::delete('/cart/{id}', [CartController::class, 'deleteCart']);

    //order
    Route::get('/orders', [OrderController::class, 'getOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'getOrderID']);
    Route::post('/orders', [OrderController::class, 'createOrder']);
    Route::put('/orders/{id}', [OrderController::class, 'updateOrder']);
    Route::delete('/orders/{id}', [OrderController::class, 'deleteOrder']);

     //order_items
    Route::get('/order_items', [Order_ItemsController::class, 'getOrderItems']);
    Route::get('/order_items/{id}', [Order_ItemsController::class, 'getOrderItemsID']);
    Route::post('/order_items', [Order_ItemsController::class, 'createOrderItems']);
    Route::put('/order_items/{id}', [Order_ItemsController::class, 'updateOrderItems']);
    Route::delete('/order_items/{id}', [Order_ItemsController::class, 'deleteOrderItems']);

         //payment
    Route::get('/payments', [PaymentController::class, 'getPayments']);
    Route::get('/payments/{id}', [PaymentController::class, 'getPaymentID']);
    Route::post('/payments', [PaymentController::class, 'createPayment']);
    Route::put('/payments/{id}', [PaymentController::class, 'updatePayment']);
    Route::delete('/payments/{id}', [PaymentController::class, 'deletePayment']);

});
 

