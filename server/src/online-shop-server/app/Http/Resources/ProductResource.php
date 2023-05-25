<?php

namespace App\Http\Resources;

use App\Models\ProductRating;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'category_id' => $this->category_id,
            'image_path' => Storage::url($this->image_path),
            'user_id' => $this->user_id,
            'rating_amount' => $this->rating()->count(),
            'rating' => $this->rating()->avg('rating')
        ];
    }
}
