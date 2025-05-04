import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  userName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as () => string,
      secretOrKey: 'abcxyz',
    });
  }

  validate(payload: JwtPayload) {
    return { authorId: payload.sub, userName: payload.userName };
  }
}
