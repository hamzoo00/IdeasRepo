<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profile\ProfileController;
use Illuminate\Http\Request;


Route::get('/profile/{id}', [ProfileController::class, 'showStudentProfile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('updateStudentProfile', [ProfileController::class, 'updateStudentProfile']);
});

