const sessions = {};

module.exports = (req, res, next) => {
  const userId = req.ip;
  if (!sessions[userId]) {
    sessions[userId] = {
      currentOrder: [],
      orderHistory: []
    };
  }
  req.session = sessions[userId];
  next();
};
