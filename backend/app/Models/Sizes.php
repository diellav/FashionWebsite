<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sizes extends Model
{
    use HasFactory;
    protected $fillable = ['productID','variantID','size', 'stock'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productID');
    }
     public function variant()
    {
        return $this->belongsTo(Product_Variants::class, 'variantID');
    }
}
