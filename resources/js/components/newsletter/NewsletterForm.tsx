import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  showName?: boolean;
  compact?: boolean;
}

export default function NewsletterForm({ 
  className = '', 
  placeholder = 'Votre adresse email',
  buttonText = "S'abonner",
  showName = false,
  compact = false
}: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('newsletter.subscribe'), {
      onSuccess: (response: any) => {
        setStatus('success');
        setMessage(response?.props?.flash?.message || 'Merci ! Vous êtes maintenant abonné à notre newsletter.');
        reset();
      },
      onError: (errors: any) => {
        setStatus('error');
        if (errors.email) {
          setMessage(errors.email);
        } else {
          setMessage('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center ${className}`}
      >
        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
        <p className="text-green-700 dark:text-green-300 font-medium">
          {message}
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setMessage('');
          }}
          className="mt-3 text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          S'abonner avec un autre email
        </button>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={compact ? 'space-y-2' : 'space-y-4'}>
        {showName && (
          <div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Votre nom (optionnel)"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        )}
        
        <div className={compact ? 'flex gap-3' : 'flex flex-col sm:flex-row gap-3'}>
          <div className="flex-1">
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder={placeholder}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={processing}
            whileHover={{ scale: processing ? 1 : 1.05 }}
            whileTap={{ scale: processing ? 1 : 0.98 }}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Envoi...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                {buttonText}
              </>
            )}
          </motion.button>
        </div>
        
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md"
          >
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">
              {message}
            </p>
          </motion.div>
        )}
        
        {errors.email && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md"
          >
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">
              {errors.email}
            </p>
          </motion.div>
        )}
      </form>
      
      {!compact && (
        <motion.p 
          className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          En vous inscrivant, vous acceptez notre politique de confidentialité.
          Nous ne partagerons jamais votre adresse e-mail.
        </motion.p>
      )}
    </div>
  );
}
