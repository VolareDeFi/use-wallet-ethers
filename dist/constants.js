"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_MATCHING_CONNECTION_METHOD = exports.INIT_ERROR = exports.METAMASK_NOT_CONNECTED_ERROR = exports.ADD_ETHEREUM_CHAIN_ERROR = exports.SWITCH_NETWORK_WARNING = exports.OTHER_WALLET_EXTENSION_WARNING = exports.SwitchChain = exports.AddEthereumChain = exports.RequestAccounts = exports.ChainId = void 0;
exports.ChainId = {
    method: "eth_chainId",
};
exports.RequestAccounts = {
    method: "eth_requestAccounts",
};
const AddEthereumChain = (config) => ({
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
exports.AddEthereumChain = AddEthereumChain;
const SwitchChain = (id) => ({
    method: "wallet_switchEthereumChain",
    params: [
        {
            chainId: `0x${id.toString(16)}`,
        },
    ],
});
exports.SwitchChain = SwitchChain;
exports.OTHER_WALLET_EXTENSION_WARNING = 'Possibly other wallet extension, might have compatibility issues';
exports.SWITCH_NETWORK_WARNING = 'Metamask is installed but not connected to the correct network, trying to switch to the correct network';
exports.ADD_ETHEREUM_CHAIN_ERROR = 'Failed to add Ethereum chain: ';
exports.METAMASK_NOT_CONNECTED_ERROR = 'Metamask is not connected to the correct network';
exports.INIT_ERROR = 'Failed to initialize wallet';
exports.NO_MATCHING_CONNECTION_METHOD = 'No matching connection method';
//# sourceMappingURL=constants.js.map