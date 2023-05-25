<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductReviewsCollection extends ResourceCollection
{
    private array $pagination;

    public function __construct($resource)
    {
        $this->pagination = [
            'currentPage' => $resource->currentPage(),
            'count' => $resource->count(),
            'totalCount' => $resource->total(),
            'totalPages' => $resource->lastPage()
        ];

        $resource = $resource->getCollection();

        parent::__construct($resource);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'user' => $review->user->name,
                    'text' => $review->text,
                ];
            }),
            'pagination' => $this->pagination
        ];
    }
}
