<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Ideas\Ideas;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <--- CRITICAL IMPORT( to pass the queue and broadcast immediately)

class IdeaRestored implements ShouldBroadcastNow
{
   
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $idea;

    public function __construct(Ideas $idea)
    {
        $this->idea = $idea->load('author');
    }

    public function broadcastOn(): array
    {
        return [new Channel('public-feed')];
    }

    public function broadcastAs()
    {
        return 'IdeaRestored';
    }
}
