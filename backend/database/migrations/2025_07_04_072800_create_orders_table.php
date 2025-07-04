<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userID')->nullable();
            $table->decimal('total_price',10,2);
            $table->text('shipping_address');
            $table->string('payment_method');
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->foreign('userID')->references('id')->on('users')->ondelete('cascade')->onupdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['userID']);
        });
        Schema::dropIfExists('orders');
    }
};
