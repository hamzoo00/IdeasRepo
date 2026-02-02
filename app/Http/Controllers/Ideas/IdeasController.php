<?php

namespace App\Http\Controllers\Ideas;

use App\Http\Controllers\Controller;
use App\Models\Ideas\Ideas;
use App\Models\Ideas\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IdeasController extends Controller
{
    public function store(Request $request)
    {
       try {
        // 1. Validate Input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string|max:300',
            'status' => 'required|in:Ongoing,Completed',
            'is_embargo' => 'boolean',
            'is_edited' => 'boolean',
            'tags' => 'required|array|min:3|max:5',
            
            // Conditional Validation
            'description' => 'required_if:is_embargo,false|nullable|string',
            'tech_stack' => 'required_if:is_embargo,false|nullable|string',
        ]);

        // 2. Determine Author
          $user = Auth::user();
        // Security Check: is it owner will add later if got i got any problem
        
        // 3. Create the Idea
        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $idea = $user->ideas()->create([
            'title' => $validated['title'],
            'summary' => $validated['summary'],
            'status' => $validated['status'],
            'is_embargo' => $validated['is_embargo'] ?? false,
            'is_edited' => $validated['is_edited'] ?? false,
            'description' => $validated['description'] ?? null,
            'tech_stack' => $validated['tech_stack'] ?? null,
        ]);

        // 4. Process Tags
        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            // Check if tag exists (e.g., "#React"), if not, create it
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }

        // 5. Attach Tags to Idea (Populate Pivot Table)
        $idea->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Idea posted successfully!',
            'idea' => $idea->load('tags')
        ], 201);
    

    } catch (\Exception $e) {
        // THIS IS THE TRAP
        // It catches the crash and sends the detailed error to your browser
        return response()->json([
            'message' => 'Something failed!',
            'error' => $e->getMessage(),   // The real error message
            'file' => $e->getFile(),       // Which file caused it
            'line' => $e->getLine()        // Which line number
        ], 500);
    }
}

}
