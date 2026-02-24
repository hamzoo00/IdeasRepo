import Echo from 'laravel-echo';
import window from 'pusher-js';

// Attach Pusher to the window object so Echo can find it
window.Pusher = window;

const echo = new Echo({
    broadcaster: 'reverb', // Or 'pusher' if you are using actual Pusher
    
    // These variables will be pulled from your frontend .env file
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

export default echo;