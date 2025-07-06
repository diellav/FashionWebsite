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
        'size',
        'color',
        'material',
        'price',
        'stock',
        'image',
       
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function product()
{
    return $this->belongsTo(Product::class, 'productID');
}
}
