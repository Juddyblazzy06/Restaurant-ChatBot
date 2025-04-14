const { getMenu, findMenuItemById } = require('../models/Menu')
const { addToOrder, placeOrder, cancelOrder } = require('../models/Order')

const validateInput = (msg) => {
  const choice = parseInt(msg)
  return !isNaN(choice) ? choice : null
}

const formatMenu = (menu) => {
  return (
    'Menu:\n' +
    menu.map((item) => `${item.id}. ${item.name} - $${item.price}`).join('\n')
  )
}

const formatOrder = (order) => {
  if (!order || order.length === 0) return 'No items in order.'
  const total = order.reduce((sum, item) => sum + item.price, 0)
  return (
    'Current Order:\n' +
    order.map((item) => `${item.name} - $${item.price}`).join('\n') +
    `\nTotal: $${total}`
  )
}

const formatOrderHistory = (history) => {
  if (!history || history.length === 0) return 'No order history.'
  return (
    'Order History:\n' +
    history
      .map((order, i) => {
        const total = order.items.reduce((sum, item) => sum + item.price, 0)
        return `#${i + 1}: ${order.items
          .map((item) => item.name)
          .join(', ')} - Total: $${total}`
      })
      .join('\n')
  )
}

const handleMessage = (req, res) => {
  const session = req.session
  const msg = req.body.message?.trim()

  if (!msg) {
    return res.json({ message: 'Please enter a valid option.' })
  }

  const choice = validateInput(msg)
  let reply = ''

  switch (msg) {
    case '1':
      reply = formatMenu(getMenu())
      break

    case '99':
      if (session.currentOrder && session.currentOrder.length > 0) {
        if (placeOrder(session)) {
          reply =
            '✅ Order placed successfully!\nType 1 to place another order.'
        } else {
          reply = '⚠️ Failed to place order. Please try again.'
        }
      } else {
        reply = '⚠️ No current order to place.'
      }
      break

    case '98':
      reply = formatOrderHistory(session.orderHistory)
      break

    case '97':
      reply = formatOrder(session.currentOrder)
      break

    case '0':
      if (session.currentOrder && session.currentOrder.length > 0) {
        cancelOrder(session)
        reply = '❌ Order cancelled.'
      } else {
        reply = '⚠️ No order to cancel.'
      }
      break

    default:
      if (choice !== null) {
        const menuItem = findMenuItemById(choice)
        if (menuItem) {
          addToOrder(session, menuItem)
          reply = `✅ ${menuItem.name} added to your order.\n${formatOrder(
            session.currentOrder
          )}`
        } else {
          reply = '⚠️ Invalid menu item. Please select a valid option.'
        }
      } else {
        reply = '⚠️ Invalid input. Please select a valid option.'
      }
  }

  res.json({ message: reply })
}

module.exports = { handleMessage }
