<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orderID');
            $table->unsignedBigInteger('productID')->nullable();
            $table->unsignedBigInteger('product_variantID')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('price',10,2);
            $table->timestamps();
             $table->foreign('orderID')->references('id')->on('orders')->ondelete('cascade')->onupdate('cascade');
              $table->foreign('productID')->references('id')->on('products')->ondelete('set null')->onupdate('cascade');
              $table->foreign('product_variantID')->references('id')->on('product_variants')->ondelete('set null')->onupdate('cascade');
        });
    }

    public function down(): void
    {
         Schema::table('order_items', function(Blueprint $table){
            $table->dropForeign(['orderID']);
            $table->dropForeign(['productID']);
            $table->dropForeign(['product_variantID']);
        });
        Schema::dropIfExists('order_items');
    }
};
