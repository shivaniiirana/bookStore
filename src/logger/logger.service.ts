import { Injectable, Inject } from '@nestjs/common';
import winston from 'winston';

@Injectable()
export class LoggerService {
  constructor(@Inject('WinstonLogger') private readonly logger: winston.Logger) {}

  log(message: string) {
    this.logger.info(message); // Logs info level messages
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - Trace: ${trace}`); // Logs error level messages with trace
  }

  warn(message: string) {
    this.logger.warn(message); // Logs warn level messages
  }

  debug(message: string) {
    this.logger.debug(message); // Logs debug level messages
  }
}
