import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // لجعل ConfigModule متاحًا بشكل عام في جميع أنحاء المشروع
      envFilePath: '.env', // تحديد مسار ملف البيئة
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
