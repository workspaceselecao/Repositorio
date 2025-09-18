'use client'

import { useState, useEffect  } from 'react'
import { ArrowDownTrayIcon  } from '@heroicons/react/24/outline'

// TypeScript interface for PWA install prompt
// interface BeforeInstallPromptEvent extends Event {
//   prompt(): Promise<void>
//   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
// }

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Previne o prompt automático
      e.preventDefault()
      // Salva o evento para usar depois
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    // Detecta se a app já está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode)').matches || 
          (window.navigator).standalone) {
        setShowInstallButton(false)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    checkIfInstalled()

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostra o prompt de instalação
    deferredPrompt.prompt()

    // Espera pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar a PWA')
    } else {
      console.log('Usuário recusou instalar a PWA')
    }

    // Limpa o prompt
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <ArrowDownTrayIcon className="h-6 w-6 text-blue-200 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Instalar App</h3>
            <p className="text-xs text-blue-200 mt-1">
              Instale o Repositório de Vagas no seu dispositivo para acesso rápido e offline.
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallButton(false)}
                className="text-blue-200 px-3 py-1 rounded text-xs hover:text-white"
              >
                Não agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}