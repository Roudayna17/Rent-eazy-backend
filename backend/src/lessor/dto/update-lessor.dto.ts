import { PartialType } from '@nestjs/swagger';
import { CreateLessorDto } from './create-lessor.dto';

export class UpdateLessorDto extends PartialType(CreateLessorDto) {}
