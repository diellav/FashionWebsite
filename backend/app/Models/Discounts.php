<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discounts extends Model
{
    use HasFactory;
    protected $table='discounts';
    protected $fillable=[
        'name',
        'value',
        'type',
        'conditions',
        'productID',
        'start_date',
        'end_date',
    ];
    protected $casts=[
        'value'=>'decimal:2',
        'start_date'=>'date',
        'end_date'=>'date',
    ];
    public function products(){
        return $this->belongsTo(Product::class, 'productID');
    }
}
