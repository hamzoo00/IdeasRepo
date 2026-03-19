<?php

use App\Http\Controllers\Admin\AnnouncementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/announcements', [AnnouncementController::class, 'storeAnnouncement']);
    Route::get('/active-announcements', [AnnouncementController::class, 'getActiveAnnouncements']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'deleteAnnouncement']);
});
