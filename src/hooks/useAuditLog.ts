import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface AuditLogEntry {
  id?: string;
  user_id: string;
  user_name: string; // Denormalized for easier display
  action: string; // e.g., 'vote_created', 'vote_cast'
  target_type?: 'vote' | 'member' | 'user';
  target_id?: string;
  details?: object; // JSONB for extra info
}

export const useAuditLog = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLog = useCallback(async (logData: Omit<AuditLogEntry, 'id' | 'user_id' | 'user_name'>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase.from('audit_log').insert([
        {
          ...logData,
          user_id: user.id,
          user_name: profile.full_name || user.email, // Assuming profile has full_name
        },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to create audit log:', err);
      // Fail silently on logging, as it's not a critical user-facing error
    }
  }, [user, profile]);

  const fetchLogs = useCallback(async (targetId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (targetId) {
        query = query.eq('target_id', targetId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, []);

  return { logs, loading, error, createLog, fetchLogs };
};
