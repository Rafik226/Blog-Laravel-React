<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email : The email address to send test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify Gmail configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            $this->info('Envoi d\'un email de test...');
            $this->info('Configuration utilisée :');
            $this->line("- Serveur SMTP : " . config('mail.mailers.smtp.host'));
            $this->line("- Port : " . config('mail.mailers.smtp.port'));
            $this->line("- Utilisateur : " . config('mail.mailers.smtp.username'));
            $this->line("- Email expéditeur : " . config('mail.from.address'));
            $this->line("- Destinataire : {$email}");
            $this->line('');
            
            Mail::raw('Ceci est un email de test pour vérifier la configuration Gmail. Envoyé le ' . now()->format('d/m/Y à H:i:s'), function ($message) use ($email) {
                $message->to($email)
                       ->subject('Test Email - Configuration Gmail - ' . now()->format('H:i:s'));
            });
            
            $this->info("Email de test envoyé avec succès à : {$email}");
            $this->info('Vérifiez votre boîte de réception (et le dossier spam).');
            
        } catch (\Exception $e) {
            $this->error('Erreur lors de l\'envoi de l\'email : ' . $e->getMessage());
            
            // Afficher des conseils de dépannage
            $this->warn('Conseils de dépannage :');
            $this->line('1. Vérifiez que le mot de passe d\'application Gmail est correct');
            $this->line('2. Assurez-vous que l\'authentification à 2 facteurs est activée sur Gmail');
            $this->line('3. Vérifiez la configuration MAIL_* dans le fichier .env');
            $this->line('4. Assurez-vous que le port 587 n\'est pas bloqué par votre firewall');
        }
    }
}
