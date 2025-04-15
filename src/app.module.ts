import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),],
    inject: [ConfigService],
    useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.getOrThrow('DB_HOST'),
        port: ConfigService.getOrThrow('DB_PORT'),
        username: ConfigService.getOrThrow('DB_USERNAME'),
        password: ConfigService.getOrThrow('DB_PASSWORD'),
        database: ConfigService.getOrThrow('DB_NAME'),
        entities:[User],
        synchronize:true,
    }),
}), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
