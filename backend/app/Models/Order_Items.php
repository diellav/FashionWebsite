<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_Items extends Model
{
    use HasFactory;
     protected $table='order_items';
    protected $fillable=[
        'name',
        'orderID',
        'product_variantID',
        'quantity',
        'price',
    ];
     protected $casts=[
        'price'=>'decimal:2',
    ];
    public function order(){
        return $this->belongsTo(Order::class, 'orderID');
    }
   
    public function product_variant(){
        return $this->belongsTo(Product_Variants::class, 'product_variantID');
    }
}
