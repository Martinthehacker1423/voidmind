export const MODELS = [
  { id: 'claude-opus-4-6',              label: 'Claude Opus 4.6',    desc: '最强，适合复杂任务' },
  { id: 'claude-sonnet-4-20250514',     label: 'Claude Sonnet 4',    desc: '均衡，日常首选' },
  { id: 'claude-haiku-4-5-20251001',    label: 'Claude Haiku 4.5',   desc: '最快，轻量任务' },
];

export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

export const PERSONAS = [
  {
    id: 'default',
    icon: '✦',
    name: '全能助手',
    desc: '默认，什么都能聊',
    systemPrompt: '',
  },
  {
    id: 'coder',
    icon: '⌨',
    name: '编程专家',
    desc: '代码、调试、技术问题',
    systemPrompt: '你是一位资深软件工程师，擅长代码编写、调试和架构设计。回答时提供具体的代码示例，使用简洁专业的语言，并主动指出潜在的问题和最佳实践。',
  },
  {
    id: 'writer',
    icon: '✍',
    name: '写作助手',
    desc: '文案、润色、创作',
    systemPrompt: '你是一位专业写手，擅长各类文案创作、文章润色和创意写作。语言风格流畅自然，富有表现力，能根据用户需求调整文风。',
  },
  {
    id: 'translator',
    icon: '🌐',
    name: '翻译官',
    desc: '中英互译，地道自然',
    systemPrompt: '你是一位专业翻译，精通中英双语互译。翻译时注重地道性和可读性，而非逐字直译。会根据上下文选择最合适的表达方式，并在必要时提供注释说明。',
  },
];

export const SUGGESTIONS = [
  '帮我写一段 Python 代码...',
  '解释一下这个概念...',
  '帮我翻译以下内容...',
];

export const DISCORD_TRIGGER = {
  MENTION: 'mention',
  ALL: 'all',
};
