<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
        'orderID' => 'nullable|exists:orders,id',
        'total_price' => 'required|numeric',
        'stripeToken' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    try {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $charge = \Stripe\Charge::create([
            'amount' => intval($request->total_price * 100),
            'currency' => 'eur',
            'source' => $request->stripeToken,
            'description' => 'Payment for Order ID: ' . $request->orderID,
        ]);

        $payment = Payment::create([
            'userID' => Auth::id(),
            'orderID' => $request->get('orderID'),
            'total_price' => $request->get('total_price'),
            'payment_status' => 'paid',
            'transaction_reference' => $charge->id,
        ]);

        return response()->json([
            'message' => 'Payment successful',
            'payment' => $payment
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Payment failed: ' . $e->getMessage()
        ], 500);
    }
}

    public function updatePayment(Request $request, $id) {
        $payment = Payment::findOrFail($id);

        $payment->update($request->only([
            'userID','orderID', 'total_price', 'payment_status', 'transaction_reference'
        ]));

        return response()->json($payment);
    }
    public function deletePayment($id) {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully']);
    }

}
