<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('phone_number');
            $table->string('address');
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('password');
            $table->unsignedBigInteger('roleID')->nullable();
            $table->timestamps();
            $table->foreign('roleID')->references('id')->on('roles')->ondelete('set null')->onupdate('cascade');
        });
    }

    public function down(): void
    {
         Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['roleID']);
        });

        Schema::dropIfExists('users');
    }
};
