import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}