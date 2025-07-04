<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userID')->nullable();
            $table->unsignedBigInteger('orderID')->nullable();
            $table->decimal('total_price',10,2);
            $table->string('payment_status')->default('pending');
            $table->string('transaction_reference')->nullable();
            $table->timestamps();
            $table->foreign('userID')->references('id')->on('users')->ondelete('set null')->onupdate('cascade');
            $table->foreign('orderID')->references('id')->on('orders')->ondelete('cascade')->onupdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function(Blueprint $table){
            $table->dropForeign(['userID']);
            $table->dropForeign(['orderID']);
        });
        Schema::dropIfExists('payments');
    }
};
