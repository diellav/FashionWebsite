<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price',10,2)->nullable();
            $table->unsignedBigInteger('categoryID')->nullable();
            $table->integer('stock')->default(0);
            $table->string('main_image')->nullable();
            $table->timestamps();
            $table->foreign('categoryID')->references('id')->on('categories')->onDelete('set null')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['categoryID']);
        });

        Schema::dropIfExists('products');
    }
};
