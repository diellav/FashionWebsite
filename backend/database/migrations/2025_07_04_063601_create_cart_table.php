<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userID')->nullable();
            $table->timestamps();
            $table->foreign('userID')->references('id')->on('users')->ondelete('set null')->onupdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('cart',function (Blueprint $table){
            $table->dropForeign(['userID']);
        });
        Schema::dropIfExists('cart');
    }
};
