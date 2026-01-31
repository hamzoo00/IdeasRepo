<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Profile\TeacherProfileController;
use Illuminate\Http\Request;


Route::get('/profile/{id}', [ProfileController::class, 'showStudentProfile']);
Route::get('/teacher/profile/{id}', [TeacherProfileController::class, 'showTeacherProfile']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('updateStudentProfile', [ProfileController::class, 'updateStudentProfile']);
    Route::put('updateTeacherProfile', [TeacherProfileController::class, 'updateTeacherProfile']);
});

