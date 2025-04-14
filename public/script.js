// Initial options display
const initialOptions = `
🤖 Welcome to Restaurant ChatBot! Choose an option:
1 - Place an Order
99 - Checkout
98 - Order History
97 - Current Order
0 - Cancel Order
`

// Check for payment callback
const urlParams = new URLSearchParams(window.location.search)
const paymentStatus = urlParams.get('status')
const paymentReference = urlParams.get('reference')

// Display initial options when page loads
document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box')

  if (paymentStatus === 'success' && paymentReference) {
    // Show payment success message
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isPaymentSuccess) {
          chatBox.innerHTML = `
            <div class="bot-message message">
              <div class="receipt">
                ${data.message
                  .split('\n')
                  .map((line) => `<p>${line}</p>`)
                  .join('')}
              </div>
              <p>Type 1 to place another order or 98 to view order history.</p>
            </div>
          `
        }
      })
  } else {
    // Show initial options
    chatBox.innerHTML = `
      <div class="welcome-message">
        <p>Welcome to our Restaurant ChatBot!</p>
      </div>
      <div class="bot-message message">
        <div class="options-list">
          ${initialOptions
            .split('\n')
            .map((line) => `<p>${line}</p>`)
            .join('')}
        </div>
      </div>
    `
  }
  chatBox.scrollTop = chatBox.scrollHeight
})

// Handle Enter key press
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage()
  }
})

function sendMessage() {
  const input = document.getElementById('user-input')
  const chatBox = document.getElementById('chat-box')
  const message = input.value.trim()

  if (!message) return

  // Display user message
  chatBox.innerHTML += `
    <div class="user-message message">
      <p>${message}</p>
    </div>
  `

  // Send message to server
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Display bot response
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      `

      // If menu should be shown, display it
      if (data.showMenu) {
        chatBox.innerHTML += `
          <div class="bot-message message">
            <div class="options-list">
              ${data.showMenu
                .split('\n')
                .map((line) => `<p>${line}</p>`)
                .join('')}
            </div>
          </div>
        `
      }

      // If payment is required, show payment button
      if (data.paymentUrl) {
        chatBox.innerHTML += `
          <div class="bot-message message">
            <p>Click below to proceed with payment:</p>
            <button onclick="window.open('${data.paymentUrl}', '_blank')">Pay Now</button>
          </div>
        `
      }

      chatBox.scrollTop = chatBox.scrollHeight
    })
    .catch((error) => {
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>⚠️ An error occurred. Please try again.</p>
        </div>
      `
      chatBox.scrollTop = chatBox.scrollHeight
    })

  input.value = ''
}
