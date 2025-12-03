// backend-v2/src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // ✅ این خط اضافه شد
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
