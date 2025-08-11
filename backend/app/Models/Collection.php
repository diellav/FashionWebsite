<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Collection extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'image', 'start_date', 'end_date'];

    protected $casts=[
        'start_date'=>'date',
        'end_date'=>'date',
    ];
    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_product');
    }
}
