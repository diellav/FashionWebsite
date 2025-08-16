<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Variants extends Model
{
    use HasFactory;
     use HasFactory;
    protected $table='product_variants';
    protected $fillable=[
        'productID',
        'color',
        'material',
       
    ];
    

    public function product()
{
    return $this->belongsTo(Product::class, 'productID');
}
public function images() {
    return $this->hasMany(ProductImages::class, 'variantID');
}
public function sizeStocks()
{
    return $this->hasMany(Sizes::class, 'variantID');
}


}
