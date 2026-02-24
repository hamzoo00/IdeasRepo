<?php

namespace App\Events;

use App\Models\Ideas\Ideas;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <--- CRITICAL IMPORT
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IdeaCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $idea;

    /**
     * Create a new event instance.
     */
    public function __construct(Ideas $idea)
    {
        // We pass the entire idea object so the frontend gets all the data immediately
        $this->idea = $idea->load('author');
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // This must match the name you put in echo.channel('public-feed')
        return [
            new Channel('public-feed'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        // This gives it a clean name so React can listen for '.IdeaCreated'
        return 'IdeaCreated';
    }
}