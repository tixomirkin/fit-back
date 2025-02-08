import { PartialType } from '@nestjs/swagger';
import { CreateTypeTrainingDto } from './create-type_training.dto';

export class UpdateTypeTrainingDto extends PartialType(CreateTypeTrainingDto) {}
