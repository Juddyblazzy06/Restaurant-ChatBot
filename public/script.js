function sendMessage() {
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const message = input.value;

  chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    });

  input.value = '';
}
