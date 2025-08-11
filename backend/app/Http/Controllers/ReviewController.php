<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class ReviewController extends Controller
{
    public function getReviews(Request $request){
          $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'id');
        $order = $request->query('order', 'asc'); 
        $search = $request->query('search', '');
        $query = Review::query();
        if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhereHas('user', function($q2) use ($search) {
                  $q2->where('first_name', 'like', "%$search%");
        })->orWhereHas('product', function($q2) use ($search) {
                  $q2->where('name', 'like', "%$search%");
        })
              ->orWhere('review_text', 'like', "%$search%")
              ->orWhere('rating', 'like', "%$search%");
            });
    }
    $query->orderBy($sort, $order);
     $users = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json($users);
    }
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
