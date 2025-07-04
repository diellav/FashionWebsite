<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cartID')->nullable();
            $table->unsignedBigInteger('productID')->nullable();
            $table->integer('quantity')->default(1);
            $table->timestamps();
            $table->foreign('cartID')->references('id')->on('cart')->ondelete('set null')->onupdate('cascade');
            $table->foreign('productID')->references('id')->on('products')->ondelete('set null')->onupdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function(Blueprint $table){
            $table->dropForeign(['cartID']);
            $table->dropForeign(['productID']);
        });

        Schema::dropIfExists('cart_items');
    }
};
