import { SetMetadata } from '@nestjs/common';
import { WorkspaceRole } from 'src/common/enums/roles.enum';

export const WORKSPACE_ROLES_KEY = 'workspace_roles';
export const WorkspaceRoles = (...roles: WorkspaceRole[]) => SetMetadata(WORKSPACE_ROLES_KEY, roles);