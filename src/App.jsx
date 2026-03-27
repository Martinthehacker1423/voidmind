import { useEffect } from 'react';
import { useSettingsStore } from './store/settingsStore.js';
import { useChatStore } from './store/chatStore.js';
import { SetupWizard } from './components/setup/SetupWizard.jsx';
import { TitleBar } from './components/layout/TitleBar.jsx';
import { MainLayout } from './components/layout/MainLayout.jsx';
import { SettingsModal } from './components/settings/SettingsModal.jsx';
import { ConfirmDialog } from './components/ui/ConfirmDialog.jsx';
import { ToastContainer } from './components/ui/Toast.jsx';
import { UpdateBanner } from './components/ui/UpdateBanner.jsx';

export default function App() {
  const { setupCompleted, loaded, loadSettings } = useSettingsStore();
  const { loadConversations } = useChatStore();

  useEffect(() => {
    loadSettings();
    loadConversations();
  }, []);

  if (!loaded) {
    // Splash / loading state
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--p-300), var(--p-500))',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 700,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        VOIDMIND
      </div>
    );
  }

  return (
    <div className="app-root">
      {!setupCompleted ? (
        <SetupWizard />
      ) : (
        <>
          <TitleBar />
          <MainLayout />
          <SettingsModal />
          <ConfirmDialog />
        </>
      )}
      <ToastContainer />
      <UpdateBanner />
    </div>
  );
}
