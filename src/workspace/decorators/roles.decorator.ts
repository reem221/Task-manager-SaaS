import { SetMetadata } from '@nestjs/common';
import { WorkspaceRole } from 'src/common/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: WorkspaceRole[]) => SetMetadata(ROLES_KEY, roles);