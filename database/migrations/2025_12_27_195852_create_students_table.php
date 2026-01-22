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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('university_name');
            $table->string('student_id')->unique();
            $table->string('batch');
            $table->string('program');
            $table->string('degree');
            $table->string('semester');
                 
            $table->string('email')->unique();
            $table->string('whatsapp')->nullable();
            $table->text('interest')->nullable();
            $table->text('bio')->nullable();
            
            $table->string('image')->nullable();
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
