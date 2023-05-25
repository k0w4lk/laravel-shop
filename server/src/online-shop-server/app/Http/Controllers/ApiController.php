<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as HttpResponse;

class ApiController extends Controller
{
    /**
     * @param array|null $data
     * @param int $code
     * 
     * @return HttpResponse|JsonResponse
     */
    protected function successResponse(array $data = null, int $code = 200): HttpResponse | JsonResponse
    {
        if (!isset($data)) {
            return response()->noContent();
        }

        return response()->json($data, $code);
    }

    protected function clientErrorResponse(int $code = 400, string $message = 'Client error'): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], $code);
    }

    protected function serverErrorResponse(int $code = 500, string $message = 'Server error'): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], $code);
    }
}
