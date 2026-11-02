/** Error yang sudah dinormalisasi dari panggilan API (bentuknya selalu sama). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly details: string[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** True jika tidak ada respons sama sekali (server mati, tertidur, atau offline). */
  get isNetwork() {
    return this.status === null
  }
}
