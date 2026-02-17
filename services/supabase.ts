
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase credentials.
 * These are injected via environment variables during deployment.
 */
const supabaseUrl = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) 
  ? process.env.VITE_SUPABASE_URL 
  : 'https://placeholder.supabase.co';

const supabaseKey = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) 
  ? process.env.VITE_SUPABASE_ANON_KEY 
  : 'placeholder-key';

const isPlaceholder = supabaseUrl.includes('placeholder') || supabaseKey === 'placeholder-key';

/**
 * A strictly in-memory storage mock to ensure cross-browser compatibility 
 * and avoid SecurityError in sandboxed or strict privacy environments 
 * where localStorage is restricted.
 */
const inMemoryStorage: Record<string, string> = {};

const noopStorage = {
  getItem: (key: string) => inMemoryStorage[key] || null,
  setItem: (key: string, value: string) => { inMemoryStorage[key] = value; },
  removeItem: (key: string) => { delete inMemoryStorage[key]; },
};

// Create client with production environment variables or fallback to a dummy client
export const supabase = createClient(
  supabaseUrl, 
  supabaseKey, 
  {
    auth: {
      storage: noopStorage,
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

export const isDemoMode = isPlaceholder;
