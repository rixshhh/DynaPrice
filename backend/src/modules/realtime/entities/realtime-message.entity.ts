export class RealtimeMessageEntity {
  constructor(
    public readonly channel: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
