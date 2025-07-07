<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function getRoles(){
        return Role::with('role')->get();
    }
    public function getRoleID($id){
        $Role=Role::with('role')->findOrFail($id);
        return response()->json($Role);
    }

     public function createRole(Request $request) {
        $validator = Validator::make($request->all(), [
            'roleName' => 'required|string|max:255',
            'description' => 'required|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $Role = Role::create([
            'roleName' => $request->get('roleName'),
            'description' => $request->get('description'),
            
        ]);

        return response()->json($Role, 201);
    }

    public function updateRole(Request $request, $id) {
        $Role = Role::findOrFail($id);

        $Role->update($request->only([
            'roleName', 'description'
        ]));

        return response()->json($Role);
    }
    public function deleteRole($id) {
        $Role = Role::findOrFail($id);
        $Role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }

}
