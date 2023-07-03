import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = 3000;
  const configPort = Number(process.env.PORT);
  if (!isNaN(configPort)) {
    port = configPort;
  }
  await app.listen(port);
}
bootstrap();
