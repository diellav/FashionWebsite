<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subcategory')->nullable();
            $table->string('description')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('parentID')->nullable();
            $table->timestamps();
            $table->foreign('parentID')->references('id')->on('categories')->onDelete('set null')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
