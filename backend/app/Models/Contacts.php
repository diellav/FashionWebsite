<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacts extends Model
{
    use HasFactory;
    protected $table='contacts';
    protected $fillable=[
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'message',
    ];
}
