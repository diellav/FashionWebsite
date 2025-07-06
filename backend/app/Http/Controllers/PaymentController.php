<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
     public function getPayments(){
        return Payment::with(['user','order'])->get();
    }
    public function getPaymentID($id){
        $payment=Payment::with(['user','order'])->findOrFail($id);
        return response()->json($payment);
    }

     public function createPayment(Request $request) {
        $validator = Validator::make($request->all(), [
            'userID' => 'nullable|exists:users,id',
            'orderID ' => 'nullable|exists:orders,id',
            'total_price' => 'required|numeric',
            'payment_status' => 'required|string|max:255',
            'transaction_reference' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $payment = Payment::create([
            'userID ' => $request->get('userID '),
            'orderID ' => $request->get('orderID '),
            'total_price' => $request->get('total_price'),
            'payment_status' => $request->get('payment_status'),
            'transaction_reference' => $request->get('transaction_reference'),
        ]);

        return response()->json($payment, 201);
    }

    public function updatePayment(Request $request, $id) {
        $payment = Payment::findOrFail($id);

        $payment->update($request->only([
            'userID','orderID ', 'total_price', 'payment_status', 'transaction_reference'
        ]));

        return response()->json($payment);
    }
    public function deletePayment($id) {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully']);
    }

}
