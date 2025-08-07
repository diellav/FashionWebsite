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
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\SizesController;
use App\Http\Controllers\VariantSizeStockController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AddressController;

    Route::post('/login',[AuthController::class,'login']);
    Route::post('/register',[AuthController::class,'register']);
    // routes/api.php
    Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('/password/reset', [ResetPasswordController::class, 'reset']);
    //home
    Route::get('/products', [ProductController::class, 'getProducts']);
    Route::get('/products/filter', [ProductController::class, 'getProductsFilter']);
    Route::post('/contacts', [ContactController::class, 'createContact']);
    Route::get('/recent-products', [ProductController::class, 'getRecentProducts']);
    Route::get('/best-products', [ProductController::class, 'getBestSellers']);
    Route::get('/sale', [ProductController::class, 'getSaleProducts']); 
    Route::get('/collections-home', [CollectionController::class, 'getCollectionHome']);
    Route::get('/deals-of-the-week', [DiscountsController::class, 'getDealsOfTheWeek']);
    Route::get('/categories', [CategoryController::class, 'getCategorys']);
    Route::get('/products/{id}', [ProductController::class, 'getProductID']);
    Route::get('/product_images', [ProductImagesController::class, 'getAllImages']);
    Route::get('/variant_size_stock', [VariantSizeStockController::class, 'getVariantSizeStocks']);
    Route::get('/sizes', [SizesController::class, 'getSizes']);
    Route::get('/products/{id}/reviews', [ReviewController::class, 'getReviewsForProduct']);
    Route::get('/similar-products/{id}', [ProductController::class, 'getSimilarProducts']);

Route::middleware('auth:api')->group(function(){
    Route::get('/me',[AuthController::class,'me']);
    Route::get('/logout',[AuthController::class,'logout']);
    Route::get('/orders/my', [OrderController::class, 'myOrders']);
    //users:
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/users/{id}', [UserController::class, 'getUserID']);
    Route::post('/users', [UserController::class, 'createUser']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    //categories
    Route::get('/categories/{id}', [CategoryController::class, 'getCategoryID']);
    Route::post('/categories', [CategoryController::class, 'createCategory']);
    Route::put('/categories/{id}', [CategoryController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [CategoryController::class, 'deleteCategory']);

     //products
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
    Route::post('/checkout', [OrderController::class, 'checkout']);
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

    //collections
    Route::get('/collections', [CollectionController::class, 'getCollections']);
    Route::get('/collections/{id}', [CollectionController::class, 'getCollectionID']);
    Route::post('/collections', [CollectionController::class, 'createCollection']);
    Route::put('/collections/{id}', [CollectionController::class, 'updateCollection']);
    Route::delete('/collections/{id}', [CollectionController::class, 'deleteCollection']);

    //contact
    Route::get('/contacts', [ContactController::class, 'getContacts']);
    Route::get('/contacts/{id}', [ContactController::class, 'getContactID']);
    Route::put('/contacts/{id}', [ContactController::class, 'updateContact']);
    Route::delete('/contacts/{id}', [ContactController::class, 'deleteContact']);

    //wishlist
    Route::get('/wishlists', [WishlistController::class, 'getWishlists']);           
    Route::get('/wishlists/{id}', [WishlistController::class, 'getWishlistID']);    
    Route::post('/wishlists', [WishlistController::class, 'createWishlist']);        
    Route::put('/wishlists/{id}', [WishlistController::class, 'updateWishlist']);    
    Route::delete('/wishlists/{id}', [WishlistController::class, 'deleteWishlist']); 

    //ProductImage
    Route::get('/product_images/{id}', [ProductImagesController::class, 'getImageById']);
    Route::put('/product_images/{id}', [ProductImagesController::class, 'updateProductImages']);
    Route::put('/product_images', [ProductImagesController::class, 'createProductImages']);
    Route::delete('/product_images/{id}', [ProductImagesController::class, 'deleteProductImages']);

    //sizes
    Route::get('/sizes_stock/{id}', [SizesController::class, 'getSizeID']);
    Route::post('/sizes_stock', [SizesController::class, 'createSize']);
    Route::put('/sizes_stock/{id}', [SizesController::class, 'updateSize']);
    Route::delete('/sizes_stock/{id}', [SizesController::class, 'deleteSize']);

    //review
    Route::post('/products/{id}/reviews', [ReviewController::class, 'createReview']);

    //addresses
    Route::get('/addresses', [AddressController::class, 'getAddresses']);
    Route::get('/addresses/{id}', [AddressController::class, 'getAddressID']);
    Route::post('/addresses', [AddressController::class, 'createAddress']);
    Route::put('/addresses/{id}', [AddressController::class, 'updateAddress']);
    Route::delete('/addresses/{id}', [AddressController::class, 'deleteAddress']);
    Route::get('/my-addresses', [AddressController::class, 'myAddresses']);

});
 
