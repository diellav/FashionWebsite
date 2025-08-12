<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('order_items', function (Blueprint $table) {
        $table->unsignedBigInteger('sizeID')->nullable()->after('product_variantID');
        $table->foreign('sizeID')->references('id')->on('sizes')
              ->onDelete('set null')
              ->onUpdate('cascade');
    });
}

public function down(): void
{
    Schema::table('order_items', function (Blueprint $table) {
        $table->dropForeign(['sizeID']);
        $table->dropColumn('sizeID');
    });
}
};
