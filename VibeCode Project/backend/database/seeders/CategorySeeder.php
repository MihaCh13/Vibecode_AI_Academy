<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Machine Learning',
                'description' => 'AI and machine learning frameworks, libraries, and tools'
            ],
            [
                'name' => 'Natural Language Processing',
                'description' => 'NLP tools for text analysis, language models, and text processing'
            ],
            [
                'name' => 'Computer Vision',
                'description' => 'Image recognition, video processing, and visual AI tools'
            ],
            [
                'name' => 'Data Analysis',
                'description' => 'Data processing, visualization, and analytics tools'
            ],
            [
                'name' => 'Code Generation',
                'description' => 'AI tools for code completion, generation, and debugging'
            ],
            [
                'name' => 'Design & UI/UX',
                'description' => 'AI-powered design tools, mockups, and UI generation'
            ],
            [
                'name' => 'Content Creation',
                'description' => 'AI tools for writing, content generation, and creative tasks'
            ],
            [
                'name' => 'Testing & QA',
                'description' => 'Automated testing, quality assurance, and debugging tools'
            ],
            [
                'name' => 'Project Management',
                'description' => 'AI tools for project planning, task management, and productivity'
            ],
            [
                'name' => 'Documentation',
                'description' => 'AI tools for generating and managing documentation'
            ],
            [
                'name' => 'API & Integration',
                'description' => 'AI APIs, webhooks, and integration tools'
            ],
            [
                'name' => 'Security',
                'description' => 'AI-powered security tools, vulnerability detection, and monitoring'
            ]
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}