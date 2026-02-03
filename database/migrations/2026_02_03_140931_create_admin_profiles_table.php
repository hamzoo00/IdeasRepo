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
        Schema::create('admin_profiles', function (Blueprint $table) {
            $table->id();
             $table->foreignId('admin_id')
                    ->constrained('admins')
                    ->cascadeOnDelete();

            $table->string('office')->nullable();
            $table->string('office_hours')->nullable();
            $table->string('profession')->nullable();
            $table->text('bio')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_profiles');
    }
};
