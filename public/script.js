// Initial options display
const initialOptions = `
🤖 Welcome to Restaurant ChatBot! Choose an option:
1 - Place an Order
99 - Checkout
98 - Order History
97 - Current Order
0 - Cancel Order
`;

// Display initial options when page loads
document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = `
    <div class="welcome-message">
      <p>Welcome to our Restaurant ChatBot!</p>
    </div>
    <div class="bot-message message">
      <div class="options-list">
        ${initialOptions.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Handle Enter key press
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const message = input.value.trim();

  if (!message) return;

  // Display user message
  chatBox.innerHTML += `
    <div class="user-message message">
      <p>${message}</p>
    </div>
  `;

  // Send message to server
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then(res => res.json())
    .then(data => {
      // Display bot response
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      `;
      
      // If payment is required, show payment button
      if (data.paymentUrl) {
        chatBox.innerHTML += `
          <div class="bot-message message">
            <p>Click below to proceed with payment:</p>
            <button onclick="window.location.href='${data.paymentUrl}'">Pay Now</button>
          </div>
        `;
      }
      
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>⚠️ An error occurred. Please try again.</p>
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    });

  input.value = '';
}
