import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { BehaviorSubject } from "rxjs";
import { Callbacks, ChainID, MetamaskConfig, WalletConnectConfig, WalletState, WalletType } from "./types";
export declare const state: WalletState;
export declare const useWallet: (wallet: WalletType, config: MetamaskConfig | WalletConnectConfig, callbacks: Callbacks) => {
    init: () => Promise<void>;
    provider: Web3Provider | null;
    signer: Signer | null;
    connected: BehaviorSubject<boolean>;
    authorized: BehaviorSubject<boolean>;
    accounts: BehaviorSubject<string[]>;
    chainId: BehaviorSubject<number>;
};
export { Web3Provider, Signer, ChainID, WalletType };
//# sourceMappingURL=index.d.ts.map