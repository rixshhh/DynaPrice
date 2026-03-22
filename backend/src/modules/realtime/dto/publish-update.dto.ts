import { IsObject, IsString } from 'class-validator';

export class PublishUpdateDto {
  @IsString()
  channel!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}
