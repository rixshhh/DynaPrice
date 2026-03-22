import { IsObject, IsString } from 'class-validator';

export class TrackEventDto {
  @IsString()
  eventName!: string;

  @IsObject()
  properties!: Record<string, unknown>;
}
