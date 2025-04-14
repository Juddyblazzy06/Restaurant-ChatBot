# Restaurant ChatBot

A simple restaurant chatbot that allows customers to place orders through a chat interface.

## Features

- Chat-based interface for placing orders
- Session-based order management
- Menu browsing and selection
- Order history tracking
- Payment integration with Paystack
- Order cancellation
- Current order viewing

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Paystack test account

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd restaurant-chatbot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
PAYSTACK_SECRET_KEY=your_paystack_test_key
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Usage

1. Open the chat interface in your browser
2. Use the following commands:
   - `1` - View menu and place order
   - `99` - Checkout current order
   - `98` - View order history
   - `97` - View current order
   - `0` - Cancel current order

## API Endpoints

- `POST /api/chat` - Handle chat messages
- `POST /api/chat/pay` - Process payment
- `GET /api/chat/payment/callback` - Payment callback

## Testing

Run tests using:

```bash
npm test
```

## Deployment

The application can be deployed on any Node.js hosting platform. Make sure to:

1. Set up environment variables
2. Configure the payment callback URL
3. Use proper SSL certificates for secure communication

## License

ISC
