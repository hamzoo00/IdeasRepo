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
        Schema::table('ideas', function (Blueprint $table) {
            $table->integer('report_count')->default(0)->after('description');
        });
        
        Schema::table('students', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false);
            $table->string('suspension_reason')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->integer('warning_count')->default(0);
        });
        
        Schema::table('teacher_profile', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false);
            $table->string('suspension_reason')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->integer('warning_count')->default(0);
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->timestamp('resolved_at')->nullable()->after('status');
        });

    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // To properly refresh, you should drop the columns here
        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn('report_count');
        });
        
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['is_suspended', 'suspension_reason', 'suspended_at', 'warning_count']);
        });

        Schema::table('teacher_profile', function (Blueprint $table) {
            $table->dropColumn(['is_suspended', 'suspension_reason', 'suspended_at', 'warning_count']);
        });
    }
};