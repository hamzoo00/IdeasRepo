<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\StudentController;
use App\Http\Controllers\Auth\TeacherController;
use App\Http\Controllers\Auth\AdminController;
use App\Models\Student;

Route::post('/register', [StudentController::class, 'register']);
Route::post('/login', [StudentController::class, 'login']);
Route::post('/teacher/login', [TeacherController::class, 'login']);
Route::post('/admin/login', [AdminController::class, 'login']);
