<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <--- CRITICAL IMPORT
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Ideas\Ideas;

class IdeaDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ideaId;

    public function __construct($ideaId)
    {
        $this->ideaId = $ideaId;
    }

    public function broadcastOn(): array
    {
        return [new Channel('public-feed')];
    }

    public function broadcastAs()
    {
        return 'IdeaDeleted';
    }
}
