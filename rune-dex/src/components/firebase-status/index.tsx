'use client';

import { useEffect, useState } from 'react';

export default function FirebaseStatus() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirebaseConfig = () => {
      const requiredVars = [
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      ];

      const demoValues = [
        'demo-api-key',
        'demo.firebaseapp.com',
        'demo-project',
        'demo-project.appspot.com',
        '123456789',
        '1:123456789:web:demo',
        'example_api_key',
        'example.firebaseapp.com',
        'example-project',
        'example-project.appspot.com'
      ];

      const configured = requiredVars.every(
        variable => variable && !demoValues.includes(variable)
      );

      setIsConfigured(configured);
      setLoading(false);
    };

    checkFirebaseConfig();
  }, []);

  if (loading) {
    return null;
  }

  if (!isConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Firebase não configurado
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Para usar a aplicação, configure as variáveis de ambiente do Firebase no arquivo <code>.env.local</code>.
                Consulte o arquivo <code>FIREBASE_README.md</code> para instruções detalhadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
