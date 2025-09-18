import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useData } from '../contexts/DataContext'

export function useRealtimeUpdates() {
  const { invalidateCache } = useData()

  useEffect(() => {
    // Configurar listeners para mudanças em tempo real
    const vagasSubscription = supabase
      .channel('vagas_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vagas' 
        }, 
        (payload) => {
          console.log('Mudança detectada na tabela vagas:', payload)
          invalidateCache()
        }
      )
      .subscribe()

    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          console.log('Mudança detectada na tabela users:', payload)
          invalidateCache()
        }
      )
      .subscribe()

    // Cleanup das subscriptions
    return () => {
      vagasSubscription.unsubscribe()
      usersSubscription.unsubscribe()
    }
  }, [invalidateCache])
}
