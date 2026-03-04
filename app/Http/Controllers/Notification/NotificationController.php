<?php

namespace App\Http\Controllers\Notification;

use App\Models\Notification\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
   
    public function index()
    {
        $user = Auth::user();

        $notifications = Notification::where('notifiable_user_id', $user->id)
            ->where('notifiable_user_type', get_class($user))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }


    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);

        // Security check
        if ($notification->notifiable_user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return response()->json(['message' => 'Notification marked as read']);
    }


    public function markAllAsRead()
    {
        $user = Auth::user();

        Notification::where('notifiable_user_id', $user->id)
            ->where('notifiable_user_type', get_class($user))
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}