<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profile\ProfileController;
use Illuminate\Http\Request;


Route::get('/profile/{id}', [ProfileController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // Route::put('/profile/update', [ProfileController::class, 'update']);
});

