<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getUsers(){
        return User::with('role')->get();
    }
    public function getUserID($id){
        $user=User::with('role')->findOrFail($id);
        return response()->json($user);
    }

     public function createUser(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|string',
            'date_of_birth' => 'required|date',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'roleID' => 'required|exists:roles,id', // admini e zgjedh rolin
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'gender' => $request->get('gender'),
            'date_of_birth' => $request->get('date_of_birth'),
            'phone_number' => $request->get('phone_number'),
            'address' => $request->get('address'),
            'email' => $request->get('email'),
            'username' => $request->get('username'),
            'password' => Hash::make($request->get('password')),
            'roleID' => $request->get('roleID'),
        ]);

        return response()->json($user, 201);
    }

    public function updateUser(Request $request, $id) {
        $user = User::findOrFail($id);

        $user->update($request->only([
            'first_name', 'last_name', 'gender', 'date_of_birth', 'phone_number',
            'address', 'email', 'username', 'roleID'
        ]));

        return response()->json($user);
    }
    public function deleteUser($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

}
