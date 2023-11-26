const { Router } = require('express');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const usersController = require('../controllers/UsersController');

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  res.json({ msg: 'Rota: users' });
});

usersRouter.post('/register', usersController.create);
usersRouter.get('/search', ensureAuthenticated, usersController.search);
usersRouter.get('/:id', ensureAuthenticated, usersController.show);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);
usersRouter.put('/', ensureAuthenticated, usersController.update);

module.exports = { usersRouter };
