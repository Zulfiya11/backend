const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
// const operatorRoutes = require('./routes/operatorRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
// app.use('/api/operator', operatorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
