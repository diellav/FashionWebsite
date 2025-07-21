<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Wishlist extends Model
{
    use HasFactory;

    protected $table = 'wishlist';

    protected $fillable = [
        'userID',
        'productID',
        'variantID',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'userID');
    }

    public function product(){
        return $this->belongsTo(Product::class, 'productID');
    }

    public function variant(){
        return $this->belongsTo(Product_Variants::class, 'variantID');
    }
}

