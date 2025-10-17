<?php

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;

class WarmCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:warm {--clear : Clear cache before warming}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Warm up the application cache with frequently accessed data';

    /**
     * Execute the console command.
     */
    public function handle(CacheService $cacheService)
    {
        $this->info('Starting cache warming...');

        if ($this->option('clear')) {
            $this->info('Clearing existing cache...');
            $cacheService->invalidateAll();
        }

        $this->info('Warming up cache...');
        $cacheService->warmUp();

        $this->info('Cache warmed up successfully!');

        // Display cache statistics
        $stats = $cacheService->getCacheStats();
        $this->table(
            ['Cache Key', 'Status'],
            collect($stats)->map(function ($cached, $key) {
                return [$key, $cached ? '✅ Cached' : '❌ Not Cached'];
            })->toArray()
        );
    }
}
