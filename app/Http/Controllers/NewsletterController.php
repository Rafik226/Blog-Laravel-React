<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use App\Mail\NewsletterMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    /**
     * S'abonner à la newsletter
     */
    public function subscribe(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|max:255',
                'name' => 'nullable|string|max:255'
            ]);

            // Vérifier si l'email existe déjà
            $existing = Newsletter::where('email', $validated['email'])->first();

            if ($existing) {
                if ($existing->is_active) {
                    return response()->json([
                        'message' => 'Cet email est déjà abonné à notre newsletter.',
                        'status' => 'already_subscribed'
                    ], 409);
                } else {
                    // Réactiver l'abonnement existant
                    $existing->resubscribe();
                    return response()->json([
                        'message' => 'Votre abonnement a été réactivé avec succès !',
                        'status' => 'resubscribed'
                    ]);
                }
            }

            // Créer un nouvel abonnement
            Newsletter::create([
                'email' => $validated['email'],
                'name' => $validated['name'] ?? null,
                'subscribed_at' => now()
            ]);

            return response()->json([
                'message' => 'Merci ! Vous êtes maintenant abonné à notre newsletter.',
                'status' => 'subscribed'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Veuillez vérifier vos données.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue. Veuillez réessayer.',
                'status' => 'error'
            ], 500);
        }
    }

    /**
     * Se désabonner de la newsletter
     */
    public function unsubscribe(Request $request, $token)
    {
        try {
            $newsletter = Newsletter::where('unsubscribe_token', $token)->first();

            if (!$newsletter) {
                return response()->json([
                    'message' => 'Lien de désabonnement invalide.',
                    'status' => 'invalid_token'
                ], 404);
            }

            if (!$newsletter->is_active) {
                return response()->json([
                    'message' => 'Vous êtes déjà désabonné de notre newsletter.',
                    'status' => 'already_unsubscribed'
                ]);
            }

            $newsletter->unsubscribe();

            return response()->json([
                'message' => 'Vous avez été désabonné avec succès de notre newsletter.',
                'status' => 'unsubscribed'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue. Veuillez réessayer.',
                'status' => 'error'
            ], 500);
        }
    }

    /**
     * Afficher le statut d'un abonnement
     */
    public function status(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $newsletter = Newsletter::where('email', $request->email)->first();

        if (!$newsletter) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Aucun abonnement trouvé pour cet email.'
            ]);
        }

        return response()->json([
            'status' => $newsletter->is_active ? 'active' : 'inactive',
            'subscribed_at' => $newsletter->subscribed_at,
            'unsubscribed_at' => $newsletter->unsubscribed_at
        ]);
    }

    /**
     * Interface d'administration - Liste des abonnés
     */
    public function index(Request $request)
    {
        $newsletters = Newsletter::query()
            ->when($request->status === 'active', fn($q) => $q->active())
            ->when($request->status === 'inactive', fn($q) => $q->where('is_active', false))
            ->when($request->search, fn($q) => $q->where('email', 'like', '%' . $request->search . '%'))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => Newsletter::count(),
            'active' => Newsletter::active()->count(),
            'inactive' => Newsletter::where('is_active', false)->count()
        ];

        return inertia('admin/Newsletters', [
            'newsletters' => $newsletters,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Exporter les abonnés en CSV
     */
    public function export(Request $request)
    {
        $query = Newsletter::query()
            ->when($request->status === 'active', fn($q) => $q->active())
            ->when($request->status === 'inactive', fn($q) => $q->where('is_active', false))
            ->when($request->search, fn($q) => $q->where('email', 'like', '%' . $request->search . '%'))
            ->orderBy('created_at', 'desc');

        $newsletters = $query->get();

        $filename = 'newsletter_subscribers_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($newsletters) {
            $file = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($file, [
                'ID',
                'Email',
                'Nom',
                'Statut',
                'Date d\'abonnement',
                'Date de désabonnement',
                'Token de désabonnement'
            ]);

            // Données
            foreach ($newsletters as $newsletter) {
                fputcsv($file, [
                    $newsletter->id,
                    $newsletter->email,
                    $newsletter->name ?? '',
                    $newsletter->is_active ? 'Actif' : 'Désabonné',
                    $newsletter->subscribed_at ? $newsletter->subscribed_at->format('d/m/Y H:i:s') : '',
                    $newsletter->unsubscribed_at ? $newsletter->unsubscribed_at->format('d/m/Y H:i:s') : '',
                    $newsletter->unsubscribe_token
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Supprimer un abonnement
     */
    public function destroy(Newsletter $newsletter)
    {
        try {
            $newsletter->delete();
            
            return back()->with('success', 'Abonnement supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', 'Une erreur est survenue lors de la suppression.');
        }
    }

    /**
     * Afficher la page de composition d'une newsletter
     */
    public function compose()
    {
        $activeSubscribers = Newsletter::active()->count();
        
        return inertia('admin/NewsletterCompose', [
            'activeSubscribers' => $activeSubscribers
        ]);
    }

    /**
     * Envoyer une newsletter
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'send_to' => 'required|in:all,active',
        ]);

        try {
            $query = Newsletter::query();
            if ($validated['send_to'] === 'active') {
                $query->active();
            }
            
            $subscribers = $query->get();
            $sentCount = 0;

            foreach ($subscribers as $subscriber) {
                try {
                    Mail::to($subscriber->email)->send(
                        new NewsletterMail(
                            $validated['subject'],
                            $validated['content'],
                            $subscriber->unsubscribe_token
                        )
                    );
                    $sentCount++;
                } catch (\Exception $e) {
                    // Log l'erreur mais continue avec les autres emails
                    \Log::error("Erreur envoi newsletter à {$subscriber->email}: " . $e->getMessage());
                }
            }

            return back()->with('success', "Newsletter envoyée à {$sentCount} abonné(s).");
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de l\'envoi de la newsletter: ' . $e->getMessage());
        }
    }

    /**
     * Afficher les paramètres de la newsletter
     */
    public function settings()
    {
        // Récupérer les paramètres depuis la configuration ou la base de données
        $settings = [
            'auto_send_enabled' => config('newsletter.auto_send_enabled', false),
            'send_on_publish' => config('newsletter.send_on_publish', false),
            'admin_email' => config('newsletter.admin_email', config('mail.from.address'))
        ];

        return Inertia::render('admin/NewsletterSettings', [
            'settings' => $settings
        ]);
    }

    /**
     * Mettre à jour les paramètres de la newsletter
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'auto_send_enabled' => 'boolean',
            'send_on_publish' => 'boolean',
            'admin_email' => 'required|email|max:255'
        ]);

        // Écrire les paramètres dans un fichier de configuration dynamique
        $configPath = config_path('newsletter.php');
        
        $configContent = "<?php\n\nreturn [\n";
        $configContent .= "    'auto_send_enabled' => " . ($validated['auto_send_enabled'] ? 'true' : 'false') . ",\n";
        $configContent .= "    'send_on_publish' => " . ($validated['send_on_publish'] ? 'true' : 'false') . ",\n";
        $configContent .= "    'admin_email' => '" . $validated['admin_email'] . "',\n";
        $configContent .= "];\n";

        try {
            file_put_contents($configPath, $configContent);
            
            // Actualiser la configuration en cache
            \Artisan::call('config:cache');
            
            return back()->with('success', 'Paramètres de newsletter mis à jour avec succès !');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la sauvegarde des paramètres: ' . $e->getMessage());
        }
    }
}
