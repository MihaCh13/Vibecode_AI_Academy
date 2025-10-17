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
            // Add new fields for enhanced AI tool information
            $table->string('official_documentation')->nullable()->after('documentation_url');
            $table->text('how_to_use')->nullable()->after('official_documentation');
            $table->text('real_examples')->nullable()->after('how_to_use');
            $table->json('images')->nullable()->after('real_examples'); // Store image paths/URLs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropColumn(['official_documentation', 'how_to_use', 'real_examples', 'images']);
        });
    }
};
