import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create-client')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get('list-clients')
  findAll() {
    return this.clientService.findAll();
  }

  @Get('Client/:id')
  findOne(@Param('id') id: number) {
    return this.clientService.findOne(id);
  }

  @Patch('update-client/:id')
  update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete('delete-client/:id')
  remove(@Param('id') id: number) {
    return this.clientService.remove(id);
  }
  @Post('delete-multiple-clients')
  removeMultiple(@Body()listUser:any){
    console.log("listUser",listUser)
    this.clientService.removeMultiple(listUser)
  }

  @Get('analytics/statistics')
  async getClientStats() {
    return this.clientService.getClientStatistics();
  }

  @Get('analytics/client/:id')
  async getClientActivity(@Param('id') id: number) {
    return this.clientService.getClientDetailsWithActivity(id);
  }
  @Get('analytics/total')
getTotalClients() {
  return this.clientService.getTotalClients();
}
@Get('analytics/activity-metrics')
async getActivityMetrics() {
    return this.clientService.getClientActivityMetrics();
}

@Get('analytics/registration-trends')
async getRegistrationTrends() {
    return this.clientService.getClientRegistrationTrends();
}
}