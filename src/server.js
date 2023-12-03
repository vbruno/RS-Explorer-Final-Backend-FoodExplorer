require('express-async-errors');
require('dotenv/config');

const cors = require('cors');
const express = require('express');

const AppError = require('./utils/AppError');
const { routes } = require('./routes');
const { UPLOADS_FOLDER } = require('./configs/upload');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/image', express.static(UPLOADS_FOLDER));

// a middleware function with no mount path. This code is executed for every request to the router
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleString('pt-br')}] - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress
    } - ${req.method} - ${req.originalUrl}`,
  );
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.get('/', (req, res) => {
  res.json({ msg: 'Servidor rodando!' });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
