import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    DatabaseModule,
    CategoryModule,
  ],
})
export class AppModule {}