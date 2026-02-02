<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ideas', function (Blueprint $table) {
            $table->id();
            $table->morphs('author');
        
            $table->string('title');
            $table->string('summary', 300);
        
            $table->text('description')->nullable();
            $table->string('tech_stack')->nullable();
            
            $table->string('status')->default('Ongoing');
            $table->boolean('is_embargo')->default(false);
             $table->boolean('is_edited')->default(false);
             
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideas');
    }
};
