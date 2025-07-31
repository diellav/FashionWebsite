<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('productID')->nullable();
            $table->unsignedBigInteger('variantID')->nullable();
            $table->string('images');
            $table->timestamps();
            $table->foreign('productID')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('variantID')->references('id')->on('product_variants')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
