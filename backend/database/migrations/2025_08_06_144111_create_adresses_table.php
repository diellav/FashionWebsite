<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
   Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userID');
            $table->string('country');
            $table->string('city');
            $table->string('postal_code');
            $table->text('address');
            $table->timestamps();

            $table->foreign('userID')->references('id')->on('users')->onDelete('cascade');
        });
}    

 
    public function down(): void
    {
        Schema::dropIfExists('adresses');
    }
};
