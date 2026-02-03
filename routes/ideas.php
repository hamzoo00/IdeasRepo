<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ideas\IdeasController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/post-idea', [IdeasController::class, 'store']);
    Route::get('/ideas/{type}/{id}', [IdeasController::class, 'getProfileIdeas']);
    Route::put('/ideas/{id}', [IdeasController::class, 'updateUserIdea']);
    Route::delete('/ideas/{id}', [IdeasController::class, 'deleteUserIdea']);

});

