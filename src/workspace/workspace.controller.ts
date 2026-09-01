import { Controller, Post, Body, Req, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceRolesGuard } from './guards/workspace-roles.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/wt-auth.guard';
import { WorkspaceRole } from 'src/entity/membership.entity';

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
  async findOne(@Param('workspaceId') workspaceId: number) {
    return this.workspaceService.findOne(workspaceId);
  }

  @Patch(':workspaceId')
  @UseGuards(WorkspaceRolesGuard)
  @Roles(WorkspaceRole.ADMIN)
  async update(@Param('workspaceId') workspaceId: number, @Body() updateDto: Partial<CreateWorkspaceDto>) {
    return this.workspaceService.update(workspaceId, updateDto);
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspaceRolesGuard)
  @Roles(WorkspaceRole.ADMIN)
  async remove(@Param('workspaceId') workspaceId: number) {
    return this.workspaceService.remove(workspaceId);
  }
 
  @Post(':workspaceId/members')
  @UseGuards(WorkspaceRolesGuard)
  @Roles(WorkspaceRole.ADMIN)
  async addMember(@Param('workspaceId') workspaceId: number, @Body('email') email: string) {
    return this.workspaceService.addMember(workspaceId, email);
  }
}