<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Report\ReportController;



Route::middleware('auth:sanctum')->group(function () {
Route::post('/reports', [ReportController::class, 'store']);
});