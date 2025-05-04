import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      // registering Redis with the NestJS cache module
      useFactory: () => ({
        store: redisStore, //tells NestJS to use Redis server instead of memory.
        host: 'localhost', // Redis is running locally
        port: 6379, //default Redis port
        ttl: 300, // default 5 min
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
