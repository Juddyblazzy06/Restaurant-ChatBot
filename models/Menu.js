const { menuItems } = require('../utils/menuItems');

function getMenu() {
  return menuItems;
}

function findMenuItemById(id) {
  return menuItems.find(item => item.id === id);
}

module.exports = { getMenu, findMenuItemById };
