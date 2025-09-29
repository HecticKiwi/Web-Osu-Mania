'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import for query parameter handling
import { toast } from "sonner";
import { supabase } from '@/lib/auth/client';
import { Auth } from '@supabase/auth-ui-react';
import { Provider } from '@supabase/supabase-js';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import { useSettingsStore } from "@/stores/settingsStore";
import { useSavedBeatmapSetsStore } from "@/stores/savedBeatmapSetsStore";
import { useHighScoresStore } from "@/stores/highScoresStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


const exportOptions = [
  { id: "settingsAndKeybinds", label: "Settings & Keybinds" },
  { id: "highScoresAndReplays", label: "Highscores & Replays" },
  { id: "savedBeatmapSets", label: "Saved Beatmaps" },
] as const;

type ExportOptionId = "settingsAndKeybinds" | "highScoresAndReplays" | "savedBeatmapSets";

const AccountTab = () => {
  // Auth Tab Settings
  const A_Client = supabase; // The supabase client instance
  const A_OAuth: Provider[] = ['google']; // OAuth providers (Must have enabled in Supabase Auth settings)
  const A_appearance = { theme: ThemeSupa };
  const A_theme = "dark";
  // End of Auth Tab Settings
  
  const [session, setSession] = useState<Session | null>(null);
  const settings = useSettingsStore.getState();
  const [selectedOptions, setSelectedOptions] = useState<Partial<Record<ExportOptionId, boolean>>>({
    settingsAndKeybinds: true,
    highScoresAndReplays: true,
    savedBeatmapSets: true,
  });
  const [loading, setLoading] = useState(false);
  const resetCode = useSearchParams().get('code'); // Get the 'code' query parameter

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
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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

  // Helper to load backup data from Supabase and restore
  const restoreBackupData = async (data: any) => {
    // Use the same method as importBackup for settings and high scores
    if (data.settings_and_keybinds) {
      const mods = useSettingsStore.getState().mods;
      localStorage.setItem("settings", data.settings_and_keybinds);
      useSettingsStore.persist.rehydrate();
      useSettingsStore.setState({ mods });
    }
    if (data.high_scores_and_replays) {
      localStorage.setItem("highScores", data.high_scores_and_replays);
      useHighScoresStore.persist.rehydrate();
    }
    // For saved beatmap sets, restore the full data directly
    if (data.saved_beatmap_sets) {
      localStorage.setItem("savedBeatmapSets", data.saved_beatmap_sets);
      useSavedBeatmapSetsStore.persist.rehydrate();
    }
  };

  // Save backup to Supabase (selected categories)
  const handleSaveSettings = async () => {
    if (!session) return;
    setLoading(true);
    await ensureUserRow(session.user.id);

    const backupData: any = {};
    if (selectedOptions.settingsAndKeybinds) {
      backupData.settings_and_keybinds = localStorage.getItem("settings");
    }
    if (selectedOptions.highScoresAndReplays) {
      backupData.high_scores_and_replays = localStorage.getItem("highScores");
    }
    if (selectedOptions.savedBeatmapSets) {
      // Save the full savedBeatmapSets data as JSON
      const savedBeatmapSets = useSavedBeatmapSetsStore.getState().savedBeatmapSets;
      backupData.saved_beatmap_sets = JSON.stringify(savedBeatmapSets);
    }

    const { error } = await supabase
      .from('data')
      .update(backupData)
      .eq('uuid', session.user.id);

    setLoading(false);

    if (error) {
      console.error('Error saving backup:', error);
    } else {
      toast.message("Sync", {
        description: "Backup saved to Supabase",
      });
    }
  };

  // Load backup from Supabase (selected categories)
  const handleLoadSettings = async () => {
    if (!session) return;
    setLoading(true);

    const columns = [
      selectedOptions.settingsAndKeybinds && "settings_and_keybinds",
      selectedOptions.highScoresAndReplays && "high_scores_and_replays",
      selectedOptions.savedBeatmapSets && "saved_beatmap_sets",
    ].filter(Boolean).join(", ");

    const { data, error } = await supabase
      .from('data')
      .select(columns)
      .eq('uuid', session.user.id)
      .single();

    setLoading(false);

    if (error) {
      console.error('Error loading backup:', error);
      return;
    }

    await restoreBackupData(data);

    toast.message("Sync", {
      description: "Backup loaded from Supabase",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear the session on logout
    localStorage.removeItem('supabase_session'); // Clear session from localStorage
    console.log('Logged out successfully');
  };

  const toggle = (id: ExportOptionId) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {resetCode ? (
        // Show password reset UI if 'code' query parameter is present
        <>
          <h2 className="text-lg font-semibold">Reset Password</h2>
          <Auth
            supabaseClient={A_Client}
            appearance={A_appearance}
            theme={A_theme}
            providers={A_OAuth}
            view="update_password" // Show password reset form
          />
        </>
      ) : !session ? (
        <>
          <h2 className="text-lg font-semibold">Login</h2>
          <Auth
            supabaseClient={A_Client}
            appearance={A_appearance}
            theme={A_theme}
            providers={A_OAuth}
          />
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Signed in as <strong>{session.user.email}</strong>
          </p>

          {/* Account Sync UI */}
          <div className="mt-6">
            <h3 className="mb-2 text-md font-semibold">Account Sync</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="pr-2 text-sm font-semibold text-muted-foreground">
                Sync Contents
              </div>
              <div className="space-y-2">
                {exportOptions.map((option) => (
                  <Label key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!selectedOptions[option.id]}
                      onCheckedChange={() => toggle(option.id)}
                    />
                    <span className={"text-gray-400"}>{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                onClick={handleSaveSettings}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                disabled={loading || !Object.values(selectedOptions).some(Boolean)}
                size="sm"
              >
                {loading ? "Saving..." : "Save Selected"}
              </Button>
              <Button
                onClick={handleLoadSettings}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                disabled={loading || !Object.values(selectedOptions).some(Boolean)}
                size="sm"
              >
                {loading ? "Loading..." : "Load Selected"}
              </Button>
              <Button
                onClick={handleLogout}
                className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                size="sm"
              >
                Log out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountTab;
