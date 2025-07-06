<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
      use HasFactory;
    protected $table='payments';
    protected $fillable=[
        'userID',
        'orderID',
        'total_price',
        'payment_status',
        'transaction_reference',
    ];
    protected $casts=[
        'total_price'=>'decimal:2',
    ];
    public function user(){
        return $this->belongsTo(User::class, 'userID');
    }
     public function order(){
        return $this->belongsTo(Order::class, 'orderID');
    }
}
