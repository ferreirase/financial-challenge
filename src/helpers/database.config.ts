import fastifyMongodb from '@fastify/mongodb';
import { FastifyInstance } from 'fastify';

const configureMongo = async (fastify: FastifyInstance) => {
  try {
    await fastify.register(fastifyMongodb, {
      url: 'mongodb://admin:admin@localhost:27017?socketTimeoutMS=30000',
      database: 'doopay'
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

export default configureMongo;
