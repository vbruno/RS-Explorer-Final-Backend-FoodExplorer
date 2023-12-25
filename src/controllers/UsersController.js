const { hash, compare } = require('bcryptjs');
const dayjs = require('dayjs');

const AppError = require('../utils/AppError');
const knex = require('../database/knex');

// eslint-disable no-unused-vars
class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Missing body parameter', 400);
    }

    if (!email.includes('@')) {
      throw new AppError('Invalid email', 400);
    }

    const [userExists] = await knex('users').where({ email });

    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    } if (password.length > 20) {
      throw new AppError('Password must be less than 20 characters', 400);
    }

    const [user] = await knex('users').insert({
      name,
      email,
      password: await hash(password, 8),
    }).returning('*');

    delete user.password;

    res.json(user);
  }

  async search(req, res) {
    const { name } = req.query;

    // console.log('name:', name);

    if (!name || name.trim() === '') throw new AppError('Missing query parameter', 400);

    const users = await knex('users')
      .select('id', 'name', 'email', 'role')
      .whereLike('name', `%${name}%`)
      .orderBy('name', 'asc');
    res.json(users);
  }

  async show(req, res) {
    const { id } = req.params;

    const [user] = await knex('users')
      .where({ id })
      .select('id', 'name', 'email', 'role');

    res.json(user);
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await knex('users').select('id', 'name', 'email', 'role').where({ id }).first();

    if (!user) {
      throw new AppError('User not found', 404);
    } else {
      const op = await knex('users').where({ id }).del();
      if (!op) {
        throw new AppError('Error deleting user', 500);
      }
    }

    res.json({ user, msg: 'Usuário deletado com sucesso!' });
  }

  async update(req, res) {
    const {
      name, email, password, oldPassword, role,
    } = req.body;
    const { id } = req.user;

    const [userExists] = await knex('users').where({ id });

    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    if (email && email !== userExists.email) {
      const [emailExists] = await knex('users').where({ email });

      if (emailExists) {
        throw new AppError('Esse email já esta cadastrado em outro usuário! Favor digitar outro email!', 400);
      }
    }

    if (password && !oldPassword) {
      throw new AppError('Você precisa informar a senha antiga para atualizar a senha.');
    }

    if (password === oldPassword) {
      throw new AppError('A nova senha não pode ser igual a senha antiga.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, userExists.password);

      if (!checkOldPassword) {
        throw new AppError('Senha antiga incorreta.');
      }

      if (password.length < 6) {
        throw new AppError('Senha precisa ter mais de 6 caracteres!', 400);
      }
    }

    if (role && role !== 'admin' && role !== 'user') {
      throw new AppError('Role inválida! Role deve ser admin ou user!', 400);
    }

    const [user] = await knex('users').where({ id }).update({
      name: name ?? userExists.name,
      email: email ?? userExists.email,
      password: password ? await hash(password, 8) : userExists.password,
      role: role ?? userExists.role,
      update_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }).returning('*');

    delete user.password;

    res.json(user);
  }
}

module.exports = new UsersController();
