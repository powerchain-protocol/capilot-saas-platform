export type TokenDescriptor = {
  id: string;
  symbol: string;
  name: string;
  network: string;
  standard: string;
  decimals: number;
  mintAddress: string | null;
  transferFeeBps: number;
  transferableReceipt: boolean;
};
