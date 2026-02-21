<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ideas\IdeasController;
use App\Models\Ideas\Ideas;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/post-idea', [IdeasController::class, 'store']);
    Route::get('/ideas/{type}/{id}', [IdeasController::class, 'getProfileIdeas']);
    Route::put('/ideas/{id}', [IdeasController::class, 'updateUserIdea']);
    Route::delete('/ideas/{id}', [IdeasController::class, 'deleteUserIdea']);
    Route::get('/my-trash-ideas', [IdeasController::class, 'myTrashIdeas']);
    Route::put('/ideas/{id}/restore', [IdeasController::class, 'restoreTrashedIdea']);
    Route::get('/my-ideas/trash-count', [IdeasController::class, 'trashCount']);

   Route::get('/feed', function ()
    {

        $ideas = Ideas::with(['author', 'tags'])
           
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ideas, 200);
    });

});

