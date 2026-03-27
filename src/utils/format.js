export function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMs / 3600000);

  if (diffMin < 1)  return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHr < 24)  return `${diffHr}小时前`;

  const isThisYear = d.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function truncate(str, len = 40) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function countWords(text) {
  if (!text) return 0;
  // Chinese chars count as 1 word each; English words by space
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || []).length;
  return chinese + english;
}

export function uuid() {
  return crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
}
