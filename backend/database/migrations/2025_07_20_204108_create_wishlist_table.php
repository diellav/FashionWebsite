<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('wishlist', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userID')->nullable();
            $table->unsignedBigInteger('productID')->nullable();
            $table->unsignedBigInteger('variantID')->nullable();
            $table->timestamps();

            $table->foreign('userID')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('productID')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('variantID')->references('id')->on('product_variants')->onDelete('cascade')->onUpdate('cascade');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('wishlist');
    }
};
