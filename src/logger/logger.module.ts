import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(
              ({
                level,
                message,
                timestamp,
              }: {
                level: string;
                message: string;
                timestamp: string;
              }) => {
                return `[${timestamp}] ${level}: ${message}`;
              },
            ),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'info', // Log only info and above
        }),
      ],
    }),
  ],
  providers: [
    LoggerService,
    {
      provide: 'WinstonLogger',
      useFactory: () =>
        winston.createLogger({
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                winston.format.printf(
                  ({
                    level,
                    message,
                    timestamp,
                  }: {
                    level: string;
                    message: string;
                    timestamp: string;
                  }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                  },
                ),
              ),
            }),
            new winston.transports.File({
              filename: 'logs/app.log',
              level: 'info',
            }),
          ],
        }),
    },
  ],
  exports: [LoggerService], // Export LoggerService for use in other modules
})
export class LoggerModule {}
