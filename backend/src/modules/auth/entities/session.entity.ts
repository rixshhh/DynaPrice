export class SessionEntity {
  constructor(
    public readonly accessToken: string,
    public readonly expiresIn: string,
  ) {}
}
