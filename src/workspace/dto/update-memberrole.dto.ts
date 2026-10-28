import { IsEnum } from "class-validator";
import { WorkspaceRole } from "src/common/enums/roles.enum";

export class UpdateMemberRoleDto {
  @IsEnum(WorkspaceRole)
  role!: WorkspaceRole;
}