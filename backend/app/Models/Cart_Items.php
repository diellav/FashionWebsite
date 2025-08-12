<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart_Items extends Model
{
    use HasFactory;
     protected $table='cart_items';
    protected $fillable=[
        'cartID',
        'productID',
        'variantID',
        'sizeID',
        'quantity',
    ];
    public function cart(){
        return $this->belongsTo(Cart::class, 'cartID');
    }
    public function product(){
        return $this->belongsTo(Product::class, 'productID');
    }
     public function variants(){
        return $this->belongsTo(Product_Variants::class, 'variantID');
    }
     public function sizes(){
        return $this->belongsTo(Sizes::class, 'sizeID');
    }
}
