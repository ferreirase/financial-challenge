import fastify from 'fastify';

const server = fastify();

server.get('/ping', async (_, response) => {
  return response.code(200).send({ error: false, message: 'PASS WITH SUCCESS!' });
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});