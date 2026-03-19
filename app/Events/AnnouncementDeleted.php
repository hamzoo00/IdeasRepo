<?php

namespace App\Events;

use App\Models\Admin\Announcement;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class AnnouncementDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

   public $announcement;
   
    public function __construct(Announcement  $announcement)
    {
        $this->announcement = $announcement;
    }


    public function broadcastOn()
    {
        return new Channel('community-announcements'); //public channel 
    }

    public function broadcastAs()
{
    return 'AnnouncementDeleted';
}
}
