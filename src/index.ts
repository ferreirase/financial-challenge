import fastifyMongodb from '@fastify/mongodb';
import fastify from 'fastify';

const server = fastify();

server.register(fastifyMongodb, {
  url: 'mongodb://admin:admin@localhost:27017',
  database: 'doopay'
});

server.get('/users', async function (_, response) {
  this.log.info('Get all users');

  const users = this.mongo.db?.collection('users').find({}).toArray() || [];

  return response.code(200).send({ users });
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});