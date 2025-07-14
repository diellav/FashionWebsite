<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table='users';
    //atribute qe duhet te mbushen me informata
    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'phone_number',
        'address',
        'email',
        'username',
        'password',
        'roleID',
    ];
//atribute qe duhet te jene hidden
    protected $hidden = [
        'password',
        'remember_token',
    ];

    //atributet qe duhet te behen Cast ne tipe tjera
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
        'password' => 'hashed',
    ];
    public function role()
{
    return $this->belongsTo(Role::class, 'roleID');
}
public function getJWTIdentifier()
    {
        return $this->getKey();
    }
public function getJWTCustomClaims()
    {
        return [];
    }
    
public function sendPasswordResetNotification($token)
{
    $this->notify(new ResetPasswordNotification($token));
}
}
