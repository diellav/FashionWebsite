<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('productID')->nullable();
            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            $table->foreign('productID')->references('id')->on('products')->ondelete('set null')->onupdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function( Blueprint $table){
            $table->dropForeign(['productID']);
        });
        Schema::dropIfExists('product_variants');
    }
};
