// Splits long text into Discord-safe chunks (<= 1900 chars) and edits message progressively
const MAX_LEN = 1900;
const EDIT_INTERVAL_MS = 800;

export async function streamReply({ channel, onChunk }) {
  // Send initial placeholder
  const msg = await channel.send('▋');
  let buffer = '';
  let parts = [''];
  let currentMsg = msg;
  let editTimer = null;
  let finished = false;

  function flushEdit() {
    if (!currentMsg || !buffer) return;
    const display = parts.join('\n\n') + (finished ? '' : ' ▋');
    currentMsg.edit(display.slice(0, 2000)).catch(() => {});
  }

  editTimer = setInterval(flushEdit, EDIT_INTERVAL_MS);

  function append(text) {
    buffer += text;
    let last = parts[parts.length - 1];
    // If appending would overflow, start a new message part
    if ((last + text).length > MAX_LEN) {
      parts.push(text);
    } else {
      parts[parts.length - 1] += text;
    }
  }

  async function finish() {
    finished = true;
    clearInterval(editTimer);
    // Final edit — no cursor
    const display = parts[0];
    await currentMsg.edit(display || '…').catch(() => {});
    // Send overflow parts as separate messages
    for (let i = 1; i < parts.length; i++) {
      await channel.send(parts[i]).catch(() => {});
    }
  }

  return { append, finish, messageId: msg.id };
}
