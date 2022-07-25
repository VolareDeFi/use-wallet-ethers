import { MetamaskConfig, ChainID } from "./types";
export declare const ChainId: {
    method: string;
};
export declare const RequestAccounts: {
    method: string;
};
export declare const AddEthereumChain: (config: MetamaskConfig) => {
    method: string;
    params: {
        chainId: string;
        chainName: string;
        rpcUrls: string[];
        iconUrls: string[];
        explorerUrls: string[];
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
    }[];
};
export declare const SwitchChain: (id: ChainID) => {
    method: string;
    params: {
        chainId: string;
    }[];
};
export declare const OTHER_WALLET_EXTENSION_WARNING = "Possibly other wallet extension, might have compatibility issues";
export declare const SWITCH_NETWORK_WARNING = "Metamask is installed but not connected to the correct network, trying to switch to the correct network";
export declare const ADD_ETHEREUM_CHAIN_ERROR = "Failed to add Ethereum chain: ";
export declare const METAMASK_NOT_CONNECTED_ERROR = "Metamask is not connected to the correct network";
export declare const INIT_ERROR = "Failed to initialize wallet";
export declare const NO_MATCHING_CONNECTION_METHOD = "No matching connection method";
//# sourceMappingURL=constants.d.ts.map