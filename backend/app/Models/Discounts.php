<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Discounts extends Model
{
    use HasFactory;
    protected $table='discounts';
    protected $fillable=[
        'name',
        'value',
        'type',
        'conditions',
        'start_date',
        'end_date',
        'image'
    ];
    protected $casts=[
        'value'=>'decimal:2',
        'start_date'=>'date',
        'end_date'=>'date',
    ];
   public function products() {
    return $this->belongsToMany(Product::class, 'discount_product', 'discount_id', 'product_id');
}

protected static function booted()
{
    static::deleting(function ($discount) {
        $discount->products()->detach();
    });
}
}
