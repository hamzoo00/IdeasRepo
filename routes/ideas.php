<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ideas\IdeasController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/post-idea', [IdeasController::class, 'store']);

});

