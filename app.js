const express = require('express');
const bodyParser = require('body-parser');
const botRoutes = require('./routes/botRoutes');
const sessionMiddleware = require('./config/session');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(sessionMiddleware);

app.use('/api/chat', botRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
