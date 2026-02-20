<?php

namespace App\Http\Controllers\Ideas;

use App\Http\Controllers\Controller;
use App\Models\Ideas\Ideas;
use App\Models\Ideas\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IdeasController extends Controller
{

   public function index($id)
   {
         //1. Authorize user
         $user = Auth::user();
         $is_owner = $user && $user->id === $id;

    // Fetch all ideas, including their author and tags, ordered by newest
    $ideas = Ideas::with(['author', 'tags'])
                  ->orderBy('created_at', 'desc')
                  ->get();

    return response()->json([
        'ideas' => $ideas,
        'is_owner' => $is_owner,
    ]);
    }


    public function store(Request $request)
    {
        // 1. Validate Input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string|max:300',
            'status' => 'required|in:In Progress,Completed',
            'is_embargo' => 'boolean',
            'is_edited' => 'boolean',
            'tags' => 'required|array|min:3|max:5',
            
            'description' => 'required_if:is_embargo,false|nullable|string',
            'tech_stack' => 'required_if:is_embargo,false|nullable|string',
        ]);

        // 2. Determine Author
          $user = Auth::user(); 
        
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
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }

        // 5. Attach Tags to Idea (Populate Pivot Table)
        $idea->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Idea posted successfully!',
            'idea' => $idea->load('tags')
        ], 201);
    

    
    }



    public function getProfileIdeas($type, $id)
    {
        // 1. Map the URL string ("student") to the Real Class ("App\Models\Student")
        $modelClass = match(strtolower($type)) {
            'student' => 'App\Models\Auth\Student',
            'teacher' => 'App\Models\Auth\Teacher',
            default => null,
        };

        if (!$modelClass) {
            return response()->json(['message' => 'Invalid user type'], 400);
        }

        // 2. Fetch ideas where author_id = $id AND author_type = $modelClass
          /** @var \App\Models\Student|\App\Models\Teacher $user */
        $ideas = Ideas::where('author_id', $id)
                     ->where('author_type', $modelClass)
                     ->with('tags', 'author')
                     ->latest()
                     ->get();

        return response()->json($ideas);
    }


    public function updateUserIdea(Request $request, $id)
    {
        $user = Auth::user();
        
        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $idea = $user->ideas()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string|max:300',
            'description' => 'nullable|string',
            'tech_stack' => 'nullable|string',
            'status' => 'required|in:In Progress,Completed,Abandoned',
            'tags' => 'required|array|min:3|max:5'
        ]);

        $idea->update([
            'title' => $validated['title'],
            'summary' => $validated['summary'],
            'description' => $validated['description'],
            'tech_stack' => $validated['tech_stack'],
            'status' => $validated['status'],
            'is_edited' => true,
        ]);

        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }

        //Sync Tags (This removes old tags and adds new ones automatically)
        $idea->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Idea updated!', 
            'idea' => $idea->load('tags')
        ]);
    }

    public function myTrashIdeas(Request $request)
    {
        
        $user = Auth::user();

        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $query = $user->ideas()->with(['tags', 'author']);

        if ($request->query('view') === 'trash') {
            $query->onlyTrashed();
        }

        return response()->json($query->latest()->get());
    }

    public function restoreTrashedIdea($id)
    {
        $user = Auth::user();
        
        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $idea = $user->ideas()->onlyTrashed()->findOrFail($id);
        
        $idea->restore();

        return response()->json(['message' => 'Idea restored successfully']);
    }

    
  public function deleteUserIdea($id)
    {
        $user = Auth::user();
        
        // 1. Find the idea, even if it is already in the trash
        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $idea = $user->ideas()->withTrashed()->findOrFail($id);

        if ($idea->trashed()) {
            // SCENARIO A: It is already in the trash -> DELETE FOREVER
            $idea->forceDelete();
            $message = 'Idea permanently deleted.';
        } else {
            // SCENARIO B: It is active -> SOFT DELETE (Move to trash)
            $idea->delete();
            $message = 'Idea moved to trash.';
        }
        
        return response()->json(['message' => $message]);
    }

    public function trashCount()
    {
        /** @var \App\Models\Student|\App\Models\Teacher $user */
        $count = Auth::user()->ideas()->onlyTrashed()->count();
        return response()->json(['count' => $count]);
    }
}
