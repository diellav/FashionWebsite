<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class ReviewController extends Controller
{
    public function getReviewsForProduct($productId) {
        $reviews = Review::with('user')
            ->where('productID', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function createReview(Request $request, $productId) {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'review_text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $review = Review::create([
            'userID' => Auth::id(),
            'productID' => $productId,
            'review_text' => $request->review_text,
            'rating' => $request->rating,
        ]);

        return response()->json($review, 201);
    }
}
