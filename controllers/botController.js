const { getMenu, findMenuItemById } = require('../models/Menu');
const { addToOrder, placeOrder, cancelOrder } = require('../models/Order');

exports.handleMessage = (req, res) => {
  const session = req.session;
  const msg = req.body.message.trim();
  const menu = getMenu();
  const choice = parseInt(msg);

  let reply = '';

  switch (msg) {
    case '1':
      reply = "Menu:\n" + menu.map(item => `${item.id}. ${item.name} - $${item.price}`).join('\n');
      break;

    case '99':
      if (placeOrder(session)) {
        reply = "✅ Order placed successfully!\nType 1 to place another order.";
      } else {
        reply = "⚠️ No current order to place.";
      }
      break;

    case '98':
      reply = session.orderHistory.length
        ? "📦 Order History:\n" + session.orderHistory.map((order, i) =>
            `#${i + 1}: ` + order.map(item => item.name).join(', ')
          ).join('\n')
        : "📭 No order history.";
      break;

    case '97':
      reply = session.currentOrder.length
        ? "🛒 Current Order:\n" + session.currentOrder.map(item => `${item.name} - $${item.price}`).join('\n')
        : "🛒 No items in current order.";
      break;

    case '0':
      cancelOrder(session);
      reply = "❌ Order cancelled.";
      break;

    default:
      if (!isNaN(choice)) {
        const menuItem = findMenuItemById(choice);
        if (menuItem) {
          addToOrder(session, menuItem);
          reply = `✅ ${menuItem.name} added to your order.`;
        } else {
          reply = "⚠️ Invalid menu item ID. Type 1 to see available meals.";
        }
      } else {
        reply = `🤖 Welcome! Choose an option:\n1 - Place an Order\n99 - Checkout\n98 - Order History\n97 - Current Order\n0 - Cancel Order`;
      }
  }

  res.json({ reply });
};
