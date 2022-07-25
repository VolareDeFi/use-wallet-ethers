import { MetamaskConfig, ChainID } from "./types";

export const ChainId = {
  method: "eth_chainId",
};

export const RequestAccounts = {
  method: "eth_requestAccounts",
};

export const AddEthereumChain = (config: MetamaskConfig) => ({
  method: "wallet_addEthereumChain",
  params: [
    {
      chainId: `0x${config.id.toString(16)}`,
      chainName: config.name,
      rpcUrls: config.rpcs,
      iconUrls: config.icons,
      explorerUrls: config.explorers,
      nativeCurrency: {
        name: config.currency.name,
        symbol: config.currency.symbol,
        decimals: config.currency.decimals,
      },
    },
  ],
});

export const SwitchChain = (id: ChainID) => ({
  method: "wallet_switchEthereumChain",
  params: [
    {
      chainId: `0x${id.toString(16)}`,
    },
  ],
});

export const OTHER_WALLET_EXTENSION_WARNING = 'Possibly other wallet extension, might have compatibility issues';

export const SWITCH_NETWORK_WARNING = 'Metamask is installed but not connected to the correct network, trying to switch to the correct network';

export const ADD_ETHEREUM_CHAIN_ERROR = 'Failed to add Ethereum chain: ';

export const METAMASK_NOT_CONNECTED_ERROR = 'Metamask is not connected to the correct network';

export const INIT_ERROR = 'Failed to initialize wallet';

export const NO_MATCHING_CONNECTION_METHOD = 'No matching connection method';