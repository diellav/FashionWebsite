<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contacts;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function getContacts(){
        return Contacts::all();
    }
    public function getContactID($id){
        $contact=Contacts->findOrFail($id);
        return response()->json($contact);
    }

     public function createContact(Request $request) {
        $validator = Validator::make($request->all(), [
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255',
        'phone_number' => 'required|string|max:255',
        'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $contact = Contacts::create([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'phone_number' => $request->get('phone_number'),
            'message' => $request->get('message'),
        ]);
        return response()->json($contact, 201);
    }

    public function updateContact(Request $request, $id) {
        $contact = Contacts::findOrFail($id);
        $contact->update($request->only([
            'first_name','last_name', 'email', 'phone_number','message'
        ]));
        return response()->json($contact);
    }
    public function deleteContact($id) {
        $contact = Contacts::findOrFail($id);
        $contact->delete();
        return response()->json(['message' => 'Contact deleted successfully']);
    }
}
