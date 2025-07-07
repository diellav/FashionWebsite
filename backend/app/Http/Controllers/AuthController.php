<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function register(Request $request){

        $messages=[
            'email.unique'=>'This email is already in use. Please use another email!',
            'username.unique'=>'This username is already in use. Please use another username!',
        ];
        $validator=Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ],$messages);
    
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }

        $costumerRole=Role::where('roleName','Customer')->first();
         if(!$costumerRole){
            return response()->json(['error'=>'Role Customer not found'],500);
        }

        $user=User::create([
            'first_name'=>$request->get('first_name'),
            'last_name'=>$request->get('last_name'),
            'gender'=>$request->get('gender'),
            'date_of_birth'=>$request->get('date_of_birth'),
            'phone_number'=>$request->get('phone_number'),
            'address'=>$request->get('address'),
            'email'=>$request->get('email'),
            'username'=>$request->get('username'),
            'password'=>Hash::make($request->get('password')),
            'roleID'=>$costumerRole->id,
        ]);
        $token=JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'),201);
    }


   public function login(Request $request){
    \Log::info('Login called');

    try {
        $credentials = $request->only('email', 'password');
        \Log::info('Credentials received:', $credentials);

        if (! $token = JWTAuth::attempt($credentials)) {
            \Log::warning('Invalid credentials');
            return response()->json(['error'=>'Invalid credentials'], 401);
        }

        $user = JWTAuth::user();
        \Log::info('Authenticated user:', ['user_id' => $user->id, 'roleID'=>$user->role->roleName]);

        if (!$user->role) {
            \Log::error('User has no role assigned.');
            return response()->json(['error' => 'User has no role assigned'], 500);
        }
        
        return response()->json([
            'token'=>$token,
            'user'=>[
                'id'=>$user->id,
                'username'=>$user->username,
                'email'=>$user->email,
                'role'=>$user->role->roleName
            ]
        ]);

    } catch (\Exception $e) {
        \Log::error('Exception in login():', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}


    public function me(){
        $user=auth('api')->user();
        return response()->json([
            'user'=>$user,
            'role'=>$user->role->roleName
        ]);
    }

    public function logout(){
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
