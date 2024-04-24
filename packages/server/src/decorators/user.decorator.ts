import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

  return request.user;
});
