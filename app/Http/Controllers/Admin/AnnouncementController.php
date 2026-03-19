<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin\Announcement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Events\NewAnnouncement;
use App\Events\AnnouncementDeleted;

class AnnouncementController extends Controller
{
     private function ensureAdmin() {
         if (!Auth::user() instanceof \App\Models\Auth\Admin) {
             abort(403, 'Unauthorized. Admin access only.');
         }
    }

    public function storeAnnouncement(Request $request) {
    $this->ensureAdmin();

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'expires_at' => 'nullable|date|after:now',
    ]);

    $announcement = Announcement::create([
        'admin_id' => auth()->id(),
        'title' => $validated['title'],
        'content' => $validated['content'],
        'expires_at' => $validated['expires_at'],
    ]);

    broadcast(new NewAnnouncement($announcement))->toOthers();

    return response()->json(['message' => 'Announcement created.', 'data' => $announcement]);
}

    public function getActiveAnnouncements() {

        $announcements = Announcement::whereNull('expires_at')
                                       ->orWhere('expires_at', '>', now())
                                       ->orderBy('created_at', 'desc')->get();
        return response()->json( $announcements);
    }

    public function deleteAnnouncement($id) {
        $this->ensureAdmin();

        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        broadcast(new AnnouncementDeleted($announcement))->toOthers();

        return response()->json(['message' => 'Announcement deleted.']);
    }
}
