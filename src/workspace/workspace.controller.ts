import { Controller, Post, Body, Req, Get, Param, Patch, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from 'src/common/guards/workspace-roles.guard';
import { WorkspaceRole } from 'src/common/enums/roles.enum';
import { WorkspaceRoles } from 'src/common/decorators/workspace-roles.decorator';
import { UpdateMemberRoleDto } from './dto/update-memberrole.dto';

@Controller('workspaces')
@UseGuards(JwtAuthGuard) 
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() createWorkspaceDto: CreateWorkspaceDto, @Req() req: any) {
    return this.workspaceService.create(createWorkspaceDto, req.user.userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.workspaceService.findAllForUser(req.user.userId);
  }

  @Get(':workspaceId')
  @UseGuards(WorkspaceRolesGuard)
  async findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.findOne(workspaceId);
  }

  @Patch(':workspaceId')
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async update(@Param('workspaceId') workspaceId: string, @Body() updateDto: Partial<CreateWorkspaceDto>) {
    return this.workspaceService.update(workspaceId, updateDto);
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async remove(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.remove(workspaceId);
  }
 
  @Post(':workspaceId/members')
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async addMember(@Param('workspaceId') workspaceId: string, @Body('email') email: string) {
    return this.workspaceService.addMember(workspaceId, email);
  }

  @Get(':workspaceId/members')
  @UseGuards(WorkspaceRolesGuard)
  getMembers(@Param('workspaceId', ParseUUIDPipe) workspaceId: string) {
    return this.workspaceService.getMembers(workspaceId);
  }

  @Patch(':workspaceId/members/:userId')
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER)
  updateMemberRole(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.workspaceService.updateMemberRole(workspaceId, userId, dto.role);
  }

  @Delete(':workspaceId/members/:userId')
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  removeMember(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.workspaceService.removeMember(workspaceId, userId);
  }
}