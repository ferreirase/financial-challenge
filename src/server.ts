import mongoose from "mongoose";
import { getApp } from './app';

async function start() {
  console.info('Starting application...');

  const app = await getApp();

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
}

void start();
