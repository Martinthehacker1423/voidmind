import { Sidebar } from './Sidebar.jsx';
import { ChatWindow } from '../chat/ChatWindow.jsx';

export function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
