<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{
    public function getUsers(Request $request){
        $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'first_name');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = User::with('role');
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('first_name', 'like', "%$search%")
              ->orWhere('last_name', 'like', "%$search%")
              ->orWhere('gender', 'like', "%$search%")
              ->orWhere('date_of_birth', 'like', "%$search%")
              ->orWhere('phone_number', 'like', "%$search%")
              ->orWhere('address', 'like', "%$search%")
              ->orWhere('email', 'like', "%$search%")
              ->orWhere('username', 'like', "%$search%");
        });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
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
            'password' => 'required|string|min:6',
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

    public function changePassword(Request $request){
        $user=auth()->user();
        $validator=Validator::make($request->all(),[
            'current_password'=>['required'],
            'new_password'=>['required', 'min:6', 'confirmed'],
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->errors()], 422);
        }
        if(!Hash::check($request->current_password, $user->password)){
            return response()->json(['message'=>'current password is incorrect'], 403);
        }
        $user->password=Hash::make($request->new_password);
        $user->save();
        return response()->json(['message' => 'Password changed successfully.']);
    }

}
