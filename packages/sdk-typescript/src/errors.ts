
export class PowerChainSdkError extends Error {
  constructor(
    message: string,
    readonly code = "SDK_ERROR",
    readonly status = 500,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "PowerChainSdkError";
  }
}
