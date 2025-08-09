<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table='categories';
    protected $fillable=[
        'name',
        'description',
        'parentID',
    ];
    public function products(){
        return $this->hasMany(Product::class, 'categoryID');
    }
    public function parent(){
        return $this->belongsTo(Category::class, 'parentID');
    }
    public function children(){
        return $this->hasMany(Category::class, 'parentID');
    }
}
