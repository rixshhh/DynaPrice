export class AnalyticsEventEntity {
  constructor(
    public readonly eventName: string,
    public readonly properties: Record<string, unknown>,
    public readonly recordedAt = new Date().toISOString(),
  ) {}
}
