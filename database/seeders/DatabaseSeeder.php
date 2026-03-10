<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Auth\Student;
use App\Models\Auth\Teacher;
use App\Models\Ideas\Ideas;
use App\Models\Ideas\Tag;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       // 1. Create 20 Students and 5 Teachers first
        Student::factory(20)->create();
        Teacher::factory(5)->create();

   

      $tagIds = Tag::pluck('id');

        // 2. Creating ideas
        Ideas::factory(30)->create()->each(function ($idea) use ($tagIds) {
            
            // 3. Randomly pick 2 to 4 tag IDs for this specific idea
            $randomTags = $tagIds->random(rand(2, 4))->toArray();

            // 4. Attach them using sync() 
            // sync() is safer than attach() in seeders as it prevents duplicates
            $idea->tags()->sync($randomTags);
        });
     Ideas::factory()->aiProject()->count(10)->create();

    }
}
