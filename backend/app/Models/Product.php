<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Collection;
use App\Models\Discounts;


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
public function discounts() {
    return $this->belongsToMany(Discounts::class, 'discount_product', 'product_id', 'discount_id');
}
    public function variants(){
        return $this->hasMany(Product_Variants::class, 'productID');
    }
    public function collections(){
    return $this->belongsToMany(Collection::class, 'collection_product');
}
public function images() {
    return $this->hasMany(ProductImages::class, 'productID');
}
public function sizeStocks()
{
    return $this->hasMany(Sizes::class, 'productID');
}
public function getDiscountedPriceAttribute()
{
    $discount = $this->discounts
        ->where('start_date', '<=', now())
        ->where('end_date', '>=', now())
        ->first();

    if (!$discount) return null;

    if ($discount->type === 'percentage') {
        return round($this->price - ($this->price * ($discount->value / 100)), 2);
    } elseif ($discount->type === 'fixed') {
        return max(0, round($this->price - $discount->value, 2));
    }

    return null;
}

}
