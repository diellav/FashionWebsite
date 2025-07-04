<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('has_variants')->default(false)->after('hasdiscount'); 
             DB::statement('ALTER TABLE products MODIFY stock INT DEFAULT 0 NULL');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('has_variants');
        });
    }
};

