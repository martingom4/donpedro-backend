export class SaveUserTokenDto {
    userId: string
    tokenHash: string
    createdByIp?: string
    expiresAt: Date
}
