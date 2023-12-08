const dayjs = require('dayjs');

const AppError = require('../utils/AppError');
const DiskStorageProvider = require('../providers/DiskStorageProvider');
const knex = require('../database/knex');

class FoodsController {
  async create(req, res) {
    const {
      type, name, image, ingredients, price, description,
    } = req.body;

    if (!type || !name || !image || !ingredients || !price || !description) {
      throw new AppError('Missing body parameter', 400);
    }

    if (!['snack', 'dessert', 'drink'].includes(type)) {
      throw new AppError('Invalid type', 400);
    }

    const [result] = await knex('foods').insert({
      type,
      name,
      image,
      ingredients,
      price,
      description,
    }).returning('*');

    return res.json(result);
  }

  async search(req, res) {
    const { search } = req.query;

    if (!search || search.trim() === '' || search.trim() === ',') throw new AppError('Missing query parameter', 400);

    if (search === '-999') {
      const resultAll = await knex('foods')
        .select('*')
        .orderBy('name', 'asc');
      return res.json(resultAll);
    }

    const result = await knex('foods')
      .select('*')
      .whereLike('name', `%${search}%`)
      .orWhereLike('ingredients', `%${search}%`)
      .orderBy('name', 'asc');
    return res.json(result);
  }

  async show(req, res) {
    const { id } = req.params;

    const [result] = await knex('foods')
      .where({ id });
      // .select('id', 'name', 'email', 'role');

    // const { ingredients } = JSON.parse(result.ingredients);
    console.log('result:', result);

    res.json(result);
  }

  async delete(req, res) {
    const { id } = req.params;

    const food = await knex('foods').select('*').where({ id }).first();

    if (!food) {
      throw new AppError('food not found', 404);
    } else {
      const op = await knex('foods').where({ id }).del();
      if (!op) {
        throw new AppError('Error deleting food', 500);
      }
    }

    res.json({ food, msg: 'Usuário deletado com sucesso!' });
  }

  async update(req, res) {
    const {
      id, type, name, image, ingredients, price, description,
    } = req.body;

    console.log('req.body:', req.body);

    if (!id || !type || !name || !image || !ingredients || !price || !description) {
      throw new AppError('Missing body parameter', 400);
    }

    if (!['snack', 'dessert', 'drink'].includes(type)) {
      throw new AppError('Invalid type', 400);
    }

    const [foodExist] = await knex('foods').where({ id });

    if (!foodExist) {
      throw new AppError('food not found', 404);
    }

    const [result] = await knex('foods').where({ id }).update({
      type: type ?? foodExist.type,
      name: name ?? foodExist.name,
      image: image ?? foodExist.image,
      ingredients: ingredients ?? foodExist.ingredients,
      price: price ?? foodExist.price,
      description: description ?? foodExist.description,
      update_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }).returning('*');

    return res.json(result);
  }

  async uploadImageDish(req, res) {
    const { id } = req.params;

    const imageDishFilename = req.file.filename;

    const diskStorageProvider = new DiskStorageProvider();

    const foods = await knex('foods').where({ id }).first();

    if (!foods) {
      throw new AppError('Foods not found', 404);
    }

    if (foods.image) {
      await diskStorageProvider.deleteFile(foods.image);
    }

    const filename = await diskStorageProvider.saveFile(imageDishFilename);
    foods.image = filename;

    await knex('foods').update({ image: filename }).where({ id });

    return res.json(foods);
  }
}

module.exports = new FoodsController();
