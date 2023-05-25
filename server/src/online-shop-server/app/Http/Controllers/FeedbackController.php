<?php

namespace App\Http\Controllers;

use App\Http\Requests\Feedback\SendFeedbackRequest;
use App\Jobs\ProcessEmail;
use App\Models\ProductRating;
use App\Models\User;

class FeedbackController extends ApiController
{
  public function send(SendFeedbackRequest $request)
  {
    try {
      $senderData = $request->all();

      $rating = new ProductRating();

      $body = $request->all();

      $rating->user_id = $body['user_id'];
      $rating->product_id = $body['product_id'];
      $rating->text = $body['message'];
      $rating->rating = $body['rating'];

      $rating->save();

      $feedbackEmailsTo = User::where('role_id', 1)->pluck('email')->toArray();

      foreach ($feedbackEmailsTo as $email) {
        $mailData = [
          "emailFrom" => $senderData['email'],
          "emailTo" => $email,
          "message" => $senderData['message'],
          'view' => 'emails.feedback'
        ];

        ProcessEmail::dispatch($mailData);
      }

      return $this->successResponse();
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }
}
