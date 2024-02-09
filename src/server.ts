import { getApp } from './app';

async function start() {
  console.info('Starting application...');

  const app = await getApp();

  app.listen({ port: 3000, host: '0.0.0.0' } , async (err, _) => {    
    if(err){
      console.error('Erro ao iniciar o servidor:', err);
      process.exit(1);
    }
  
    console.log('Servidor está rodando em http://localhost:3000');
  });
}

void start();
