import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.PORT) || 3000;
    app.enableCors();

    app.getHttpAdapter().get('/', (req, res) => res.send({ message: 'Server Running Successfully!' }));

    // 🔍 TROUBLESHOOTING LOG: This will print every single route your server actually sees
    const server = app.getHttpServer();
    const router = server._events.request._router;
    console.log('--- ALL REGISTERED ROUTES ON THIS SERVER ---');
    const routerInstance = app.getHttpAdapter().getInstance();
    const routes = routerInstance?._router?.stack ?? routerInstance?.router?.stack ?? [];
    routes.forEach((layer: any) => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods)
                .filter((method) => layer.route.methods[method])
                .map((method) => method.toUpperCase());
            console.log(`ROUTE: [${methods.join(', ')}] -> ${layer.route.path}`);
        }
    });
    console.log('--------------------------------------------');

    await app.listen(port, '0.0.0.0');
    console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();
