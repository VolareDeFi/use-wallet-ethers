import { Signer } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export enum WalletType {
  Metamask = "metamask",
  Ledger = "ledger",
  Trezor = "trezor",
  WalletConnect = "walletconnect",
}

export enum ChainID {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  BSC = 56,
  BSCTestnet = 97,
  Fantom = 250,
  FantomTestnet = 4002,
  Avalanche = 43114,
  Fuji = 43113,
}

export interface MetamaskConfig {
  id: ChainID;
  name: string;
  rpcs: string[];
  icons: string[];
  explorers: string[];
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface WalletConnectConfig {
  infuraId: string;
}

export interface BaseRequest {
  method: string;
  params?: any[];
}

export interface JsonRpcRequest extends BaseRequest {
  id: number;
  jsonrpc: string;
}

export interface RpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface EthereumProvider {
  on: (event: string, callback: (...args: any[]) => void) => void;
  request: (request: BaseRequest) => Promise<any>;
  isConnected: () => boolean | undefined;
  isMetaMask?: boolean;
  isLedger: boolean | undefined;
  isTrezor: boolean | undefined;
  isWalletConnect: boolean | undefined;
}

export interface Callbacks {
  onConnect?: (chainId: string) => void;
  onDisconnect?: (error: RpcError) => void;
  onAccountsChanged?: (accounts: string[]) => void;
  onChainChanged?: (chainId: string) => void;
}

export interface WalletState {
  provider: Web3Provider | null;
  signer: Signer | null;
}

