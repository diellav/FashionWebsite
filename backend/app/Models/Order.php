<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
     protected $table='orders';
    protected $fillable=[
        'userID',
        'total_price',
        'shipping_address',
        'payment_method',
        'status',
    ];
     protected $casts=[
        'total_price'=>'decimal:2',
    ];
    public function user(){
        return $this->belongsTo(User::class, 'userID');
    }
}

