<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table='products';
    protected $fillable=[
        'name',
        'description',
        'price',
        'categoryID',
        'stock',
        'main_image',
        'hasdiscount',
        'has_variants',
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
    ];
    public function category()
{
    return $this->belongsTo(Category::class, 'categoryID');
}
    public function discounts(){
        return $this->hasMany(Discounts::class, 'productID');
    }
    public function variants(){
        return $this->hasMany(Product_Variants::class, 'productID');
    }
}
