import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;

  if (fs.existsSync('server.key') && fs.existsSync('server.cert')) {
    httpsOptions = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors();

  await app.listen(3001);
}
void bootstrap();
