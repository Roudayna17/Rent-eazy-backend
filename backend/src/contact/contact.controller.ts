import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get('create-contact')
  findAll() {
    return this.contactService.findAll();
  }

  @Get('detail-contact/:id')
  findOne(@Param('id') id: number) {
    return this.contactService.findOne(id);
  }

  @Patch('update-contact/:id')
  update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete('delete-contact/:id')
  remove(@Param('id') id: number) {
    return this.contactService.delete(id);
  }
}
