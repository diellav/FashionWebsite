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
        'quantity',
    ];
    public function cart(){
        return $this->belongsTo(Cart::class, 'cartID');
    }
    public function products(){
        return $this->belongsTo(Product::class, 'productID');
    }
     public function variants(){
        return $this->belongsTo(Product_Variants::class, 'variantID');
    }
}
