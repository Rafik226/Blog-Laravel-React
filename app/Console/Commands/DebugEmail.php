<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class DebugEmail extends Command
{
    protected $signature = 'debug:email {email}';
    protected $description = 'Debug email sending with detailed logs';

    public function handle()
    {
        $email = $this->argument('email');
        
        // Activer le debug des emails
        config(['mail.log_channel' => 'single']);
        
        $this->info('=== DEBUG EMAIL SENDING ===');
        $this->info('Configuration complète :');
        
        $mailConfig = config('mail');
        $this->line("- Driver par défaut : " . $mailConfig['default']);
        $this->line("- Host SMTP : " . $mailConfig['mailers']['smtp']['host']);
        $this->line("- Port SMTP : " . $mailConfig['mailers']['smtp']['port']);
        $this->line("- Username : " . $mailConfig['mailers']['smtp']['username']);
        $this->line("- From Address : " . $mailConfig['from']['address']);
        $this->line("- From Name : " . $mailConfig['from']['name']);
        
        $this->info('');
        $this->info('Variables d\'environnement :');
        $this->line("- MAIL_MAILER : " . env('MAIL_MAILER'));
        $this->line("- MAIL_HOST : " . env('MAIL_HOST'));
        $this->line("- MAIL_PORT : " . env('MAIL_PORT'));
        $this->line("- MAIL_USERNAME : " . env('MAIL_USERNAME'));
        $this->line("- MAIL_ENCRYPTION : " . env('MAIL_ENCRYPTION'));
        
        $this->info('');
        $this->info('Test de connexion SMTP...');
        
        try {
            // Test basique
            Mail::raw('Email de debug envoyé le ' . now()->format('d/m/Y à H:i:s') . "\n\nCeci est un test de diagnostic pour vérifier pourquoi les emails n'arrivent pas.", function ($message) use ($email) {
                $message->to($email)
                       ->subject('🔧 Debug Email Test - ' . now()->format('H:i:s'))
                       ->from(config('mail.from.address'), 'Debug Test Blog');
            });
            
            $this->info('✅ Email envoyé avec succès !');
            $this->warn('Si vous ne recevez pas cet email, vérifiez :');
            $this->line('1. Votre dossier SPAM/Indésirables');
            $this->line('2. Les onglets Gmail (Principale, Promotions, etc.)');
            $this->line('3. Que l\'adresse email est correcte');
            $this->line('4. Les paramètres de sécurité Gmail');
            
        } catch (\Exception $e) {
            $this->error('❌ Erreur lors de l\'envoi :');
            $this->error($e->getMessage());
            
            if (str_contains($e->getMessage(), 'Authentication')) {
                $this->warn('Problème d\'authentification Gmail :');
                $this->line('- Vérifiez le mot de passe d\'application');
                $this->line('- Activez l\'authentification à 2 facteurs');
            } elseif (str_contains($e->getMessage(), 'Connection')) {
                $this->warn('Problème de connexion :');
                $this->line('- Vérifiez votre connexion internet');
                $this->line('- Le port 587 n\'est peut-être pas ouvert');
            }
        }
    }
}
