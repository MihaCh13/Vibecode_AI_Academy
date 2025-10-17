<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create sample users for each role
        $users = [
            [
                'name' => 'Ivan Ivanov',
                'email' => 'ivan@admin.local',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ],
            [
                'name' => 'Admin Owner',
                'email' => 'owner@example.com',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ],
            [
                'name' => 'Elena Petrova',
                'email' => 'elena@frontend.local',
                'password' => Hash::make('password'),
                'role' => 'frontend',
            ],
            [
                'name' => 'Petar Georgiev',
                'email' => 'petar@backend.local',
                'password' => Hash::make('password'),
                'role' => 'backend',
            ],
            [
                'name' => 'Maria Dimitrov',
                'email' => 'maria@pm.local',
                'password' => Hash::make('password'),
                'role' => 'pm',
            ],
            [
                'name' => 'Nikolay Stoyanov',
                'email' => 'nikolay@qa.local',
                'password' => Hash::make('password'),
                'role' => 'qa',
            ],
            [
                'name' => 'Sofia Vasileva',
                'email' => 'sofia@designer.local',
                'password' => Hash::make('password'),
                'role' => 'designer',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // Seed categories
        $this->call(CategorySeeder::class);
    }
}
