const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const foodsController = require('../controllers/FoodsController');

const foodsRoutes = Router();
const upload = multer(uploadConfig.MULTER);

foodsRoutes.get('/', (req, res) => {
  res.json({ msg: 'Rota: foods' });
});

foodsRoutes.use(ensureAuthenticated);

foodsRoutes.post('/register', foodsController.create);
foodsRoutes.get('/search', foodsController.search);
foodsRoutes.get('/:id', foodsController.show);
foodsRoutes.delete('/:id', foodsController.delete);
foodsRoutes.put('/update', foodsController.update);

foodsRoutes.patch(
  '/uploadImageDish/:id',
  upload.single('imageDish'),
  foodsController.uploadImageDish,
);

module.exports = { foodsRoutes };
