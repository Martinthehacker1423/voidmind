import { Modal } from '../ui/Modal.jsx';
import { useUIStore } from '../../store/uiStore.js';
import { ApiTab }     from './tabs/ApiTab.jsx';
import { ModelTab }   from './tabs/ModelTab.jsx';
import { PersonaTab } from './tabs/PersonaTab.jsx';
import { DiscordTab } from './tabs/DiscordTab.jsx';
import { DataTab }    from './tabs/DataTab.jsx';

const TABS = [
  { id: 'api',     icon: '🔑', label: 'API Key' },
  { id: 'model',   icon: '🤖', label: '模型' },
  { id: 'persona', icon: '✦',  label: '角色设定' },
  { id: 'discord', icon: '🎮', label: 'Discord' },
  { id: 'data',    icon: '💾', label: '数据' },
];

export function SettingsModal() {
  const { settingsOpen, settingsTab, closeSettings, setSettingsTab } = useUIStore();

  function renderTab() {
    switch (settingsTab) {
      case 'api':     return <ApiTab />;
      case 'model':   return <ModelTab />;
      case 'persona': return <PersonaTab />;
      case 'discord': return <DiscordTab />;
      case 'data':    return <DataTab />;
      default:        return <ApiTab />;
    }
  }

  return (
    <Modal open={settingsOpen} onClose={closeSettings}>
      <div className="modal-header">
        <span className="modal-title">设置</span>
        <button className="modal-close" onClick={closeSettings}>×</button>
      </div>
      <div className="modal-layout">
        <div className="modal-tabs">
          {TABS.map(t => (
            <div
              key={t.id}
              className={`modal-tab-item ${settingsTab === t.id ? 'active' : ''}`}
              onClick={() => setSettingsTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
        <div className="modal-content">
          {renderTab()}
        </div>
      </div>
    </Modal>
  );
}
