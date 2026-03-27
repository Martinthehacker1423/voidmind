import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatTime } from '../../utils/format.js';
import { useToast } from '../../hooks/useToast.js';

export function MessageBubble({ message }) {
  const toast = useToast();
  const isAI = message.role === 'assistant';

  function copyContent() {
    navigator.clipboard.writeText(message.content).then(() => {
      toast.info('已复制到剪贴板');
    });
  }

  return (
    <div className={isAI ? 'msg-ai' : 'msg-user'}>
      <div className="msg-content selectable">
        {isAI ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {message.content || '▋'}
          </ReactMarkdown>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
        )}
      </div>
      <div className="msg-meta">
        <span>{formatTime(message.timestamp)}</span>
        {message.model && (
          <span style={{ opacity: 0.6 }}>· {message.model.split('-').slice(0, 2).join('-')}</span>
        )}
        {isAI && (
          <div className="msg-actions">
            <button className="msg-action-btn" onClick={copyContent} title="复制">⎘</button>
          </div>
        )}
      </div>
    </div>
  );
}
