<?php

use App\Http\Controllers\Admin\AdminActionController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->group(function () {
    Route::delete('/admin/ideas/{id}', [AdminActionController::class, 'deleteIdea']);
    Route::post('/admin/users/warn', [AdminActionController::class, 'warnUser']);
    Route::post('/admin/users/suspend', [AdminActionController::class, 'toggleSuspension']);
    Route::delete('/admin/user/{userId}/{userType}', [AdminActionController::class, 'deleteUserAccount']);
});