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
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->string('documentation_url')->nullable()->after('link');
            $table->string('video_demo')->nullable()->after('documentation_url');
            $table->json('tags')->nullable()->after('video_demo');

            // Add indexes for better performance
            $table->index('documentation_url');
            $table->index('video_demo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropIndex(['documentation_url']);
            $table->dropIndex(['video_demo']);
            $table->dropColumn(['documentation_url', 'video_demo', 'tags']);
        });
    }
};