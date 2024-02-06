declare module '@inaiat/fastify-di-plugin' {
  interface Cradle {
    userService: UserService;
    userRepository: UserRepository;
  }
}; 

import { fastifyDiPlugin } from '@inaiat/fastify-di-plugin';
import { asClass } from "awilix";
import dotenv from 'dotenv';
import fastify from 'fastify';
import mongoose from 'mongoose';
import UserRepository from "./modules/user/respository/user.repository";
import UserService from "./modules/user/service/user.service";

dotenv.config();

const app = fastify();

app.register(fastifyDiPlugin, {
  module: {
    userService: asClass(UserService).singleton(),
    userRepository: asClass(UserRepository).singleton(),
  },
});

app.get('/users', async function (req, res) {
  return res.send({ users: await this.diContainer.resolve('userService').findAll() });
});

app.listen({ port: 3000} , async (err, _) => {
  await mongoose.connect(process.env.MONGO_URL || '', {
    dbName: process.env.MONGO_DBNAME
  }).catch(err => {
    console.error('Erro ao conectar com o Mongo:', err);
    process.exit(1);
  });
  
  if(err){
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }

  console.log('Servidor está rodando em http://localhost:3000');
});
