<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImages extends Model
{
    use HasFactory;
     use HasFactory;

    protected $table = 'product_images';

    protected $fillable = [
        'productID',
        'variantID',
        'images',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variant()
    {
        return $this->belongsTo(Product_Variants::class, 'variant_id');
    }
}
