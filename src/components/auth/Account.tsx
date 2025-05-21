'use client';

import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/auth/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import {
  Settings,
  useSettingsStore,
} from "@/stores/settingsStore";


const AccountTab = () => {
  const [session, setSession] = useState<Session | null>(null);
  const settings = useSettingsStore.getState();
  const setSettings = useSettingsStore.setState;

  useEffect(() => {
    const loadSession = async () => {
      // Check if session is stored in localStorage
      const storedSession = localStorage.getItem('supabase_session');
      if (storedSession) {
        setSession(JSON.parse(storedSession)); // Set session from localStorage
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error loading session:', error.message);
          return;
        }
        setSession(data.session);

        // Persist session in localStorage
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update session on change

      // Persist session when auth state changes
      if (session) {
        localStorage.setItem('supabase_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabase_session'); // Clear session if logged out
      }
    });

    return () => subscription.unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  // Create a settings row if not already present
  const ensureUserRow = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('uuid')
        .eq('uuid', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking user row:', error);
        return;
      }

      if (!data) {
        const { error } = await supabase.from('data').insert({ uuid: userId, settings });
        if (error) {
          console.error('Error inserting user row:', error);
        }
      }
    } catch (err) {
      console.error('Error in ensureUserRow:', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!session) return;
    await ensureUserRow(session.user.id);
    const { error } = await supabase
      .from('data')
      .update({ settings })
      .eq('uuid', session.user.id);

    if (error) {
      console.error('Error saving settings:', error);
    } else {
      toast.message("Sync", {
        description: "Settings saved to Supabase",
      });
    }
  };

  const handleLoadSettings = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from('data')
      .select('settings')
      .eq('uuid', session.user.id)
      .single();

    if (error) {
      console.error('Error loading settings:', error);
      return;
    }

    if (data?.settings) {
      setSettings(() => data.settings as Settings);
      toast.message("Sync", {
        description: "Settings loaded from Supabase",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear the session on logout
    localStorage.removeItem('supabase_session'); // Clear session from localStorage
    console.log('Logged out successfully');
  };

  return (
    <div className="space-y-4">
      {!session ? (
        <>
          <h2 className="text-lg font-semibold">Login</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={['google']}
          />
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Signed in as <strong>{session.user.email}</strong>
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleSaveSettings}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Settings
            </button>
            <button
              onClick={handleLoadSettings}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Load Settings
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountTab;
