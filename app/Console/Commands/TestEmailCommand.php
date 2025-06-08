<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewsletterMail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test l\'envoi d\'email de newsletter';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Test d'envoi d'email vers: {$email}");
        
        try {
            // Test de configuration mail
            $this->info('Configuration mail:');
            $this->line('MAIL_MAILER: ' . config('mail.default'));
            $this->line('MAIL_HOST: ' . config('mail.mailers.smtp.host'));
            $this->line('MAIL_PORT: ' . config('mail.mailers.smtp.port'));
            $this->line('MAIL_USERNAME: ' . config('mail.mailers.smtp.username'));
            $this->line('MAIL_FROM: ' . config('mail.from.address'));
            
            // Test d'envoi
            Mail::to($email)->send(new NewsletterMail(
                'Test Newsletter - ' . now()->format('Y-m-d H:i:s'),
                '<h2>Test d\'envoi de newsletter</h2><p>Si vous recevez cet email, la configuration fonctionne correctement!</p>',
                'test-token'
            ));
            
            $this->info('Email envoyé avec succès!');
            
        } catch (\Exception $e) {
            $this->error('Erreur lors de l\'envoi: ' . $e->getMessage());
            $this->error('Trace: ' . $e->getTraceAsString());
            return 1;
        }
        
        return 0;
    }
}
