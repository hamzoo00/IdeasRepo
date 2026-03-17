<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Ideas\Ideas;
use Illuminate\Support\Facades\Auth;
use App\Models\Report\Report;

class ModerationController extends Controller
{
    // Resuable Functions

    private function ensureAdmin() {
         if (!Auth::user() instanceof \App\Models\Auth\Admin) {
             abort(403, 'Unauthorized. Admin access only.');
         }
    }


   public function getPriorityQueue()
   {
       $this->ensureAdmin();

       return Ideas::where('report_count', '>=', 5)
           ->with(['author', 'reports' => function($query) {
               $query->where('status', 'pending')->with('reporter')->latest();
           }])
           ->orderBy('created_at', 'asc') // First-in, First-out
           ->get();
   }

   public function getGeneralQueue()
   {
         $this->ensureAdmin();

         // Ideas with 1-4 reports
         return Ideas::where('report_count', '>', 0)
             ->where('report_count', '<', 5)
             ->with(['author', 'reports' => function($query) {
                 $query->where('status', 'pending')->with('reporter')->latest();
             }])
             ->orderBy('created_at', 'asc')
             ->get();
    }
    
}
