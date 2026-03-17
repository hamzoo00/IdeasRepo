<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\Admin\AdminActionController;

// Using prefix to show difference between admin actions and moderation queues
Route::prefix('admin/moderation')->middleware(['auth:admin'])->group(function () {
    
    Route::get('/priority', [ModerationController::class, 'getPriorityQueue']);
    Route::get('/general', [ModerationController::class, 'getGeneralQueue']);
    
    Route::post('/dismiss/{ideaId}', [AdminActionController::class, 'dismissReport']);
    Route::delete('/admin/ideas/{id}', [AdminActionController::class, 'deleteIdea']);
    Route::post('/admin/users/warn', [AdminActionController::class, 'warnUser']);
    Route::post('/admin/users/suspend', [AdminActionController::class, 'toggleSuspension']);
    Route::delete('/user/{userId}', [AdminActionController::class, 'permanentlyDeleteUser']);
});