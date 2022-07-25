"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletType = exports.ChainID = exports.Signer = exports.Web3Provider = exports.useWallet = exports.state = void 0;
const providers_1 = require("@ethersproject/providers");
Object.defineProperty(exports, "Web3Provider", { enumerable: true, get: function () { return providers_1.Web3Provider; } });
const detect_provider_1 = __importDefault(require("@metamask/detect-provider"));
const onboarding_1 = __importDefault(require("@metamask/onboarding"));
const index_min_js_1 = __importDefault(require("@walletconnect/web3-provider/dist/umd/index.min.js"));
const ethers_1 = require("ethers");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return ethers_1.Signer; } });
const rxjs_1 = require("rxjs");
const constants_1 = require("./constants");
const types_1 = require("./types");
Object.defineProperty(exports, "ChainID", { enumerable: true, get: function () { return types_1.ChainID; } });
Object.defineProperty(exports, "WalletType", { enumerable: true, get: function () { return types_1.WalletType; } });
exports.state = {
    provider: null,
    signer: null,
};
const useWallet = (wallet, config, callbacks) => {
    const connected = new rxjs_1.BehaviorSubject(false);
    const authorized = new rxjs_1.BehaviorSubject(false);
    const chainId = new rxjs_1.BehaviorSubject(0);
    const accounts = new rxjs_1.BehaviorSubject([]);
    const switchChain = async (config) => {
        try {
            await window.ethereum.request((0, constants_1.SwitchChain)(config.id));
        }
        catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request((0, constants_1.AddEthereumChain)(config));
                }
                catch (addError) {
                    console.error(constants_1.ADD_ETHEREUM_CHAIN_ERROR, addError);
                }
            }
        }
    };
    const onMetamask = (config) => {
        console.log(window.ethereum);
        window.ethereum.on("connect", ({ _chainId }) => {
            console.log("connected", _chainId);
            if (callbacks.onConnect)
                callbacks.onConnect(_chainId);
            connected.next(true);
            chainId.next(parseInt(_chainId, 16));
            if (parseInt(_chainId, 16) !== config.id) {
                switchChain(config);
            }
        });
        window.ethereum.on("disconnect", (error) => {
            if (callbacks.onDisconnect)
                callbacks.onDisconnect(error);
            connected.next(false);
            authorized.next(false);
        });
        window.ethereum.on("accountsChanged", (_accounts) => {
            if (callbacks.onAccountsChanged)
                callbacks.onAccountsChanged(_accounts);
            accounts.next(_accounts);
            authorized.next(_accounts.length !== 0);
        });
        window.ethereum.on("chainChanged", (_chainId) => {
            if (callbacks.onChainChanged)
                callbacks.onChainChanged(_chainId);
            connected.next(true);
            chainId.next(parseInt(_chainId, 16));
            if (parseInt(_chainId, 16) !== config.id) {
                switchChain(config);
            }
        });
    };
    const onWalletConnect = (provider) => {
        provider.on("accountsChanged", (addresses) => {
            console.log(addresses);
            if (addresses.length > 0) {
                authorized.next(true);
                accounts.next(addresses);
            }
            else {
                authorized.next(false);
                accounts.next([]);
            }
            if (callbacks.onAccountsChanged)
                callbacks.onAccountsChanged(addresses);
        });
        provider.on("chainChanged", (chainId) => {
            console.log(chainId);
            if (callbacks.onChainChanged)
                callbacks.onChainChanged(chainId.toString(16));
        });
        provider.on("disconnect", (code, reason) => {
            console.log(code, reason);
            if (callbacks.onDisconnect)
                callbacks.onDisconnect({
                    name: "Disconnect Error",
                    code,
                    message: reason,
                });
        });
    };
    const init = async () => {
        try {
            switch (wallet) {
                case "metamask":
                    const onboarding = new onboarding_1.default();
                    if (onboarding_1.default.isMetaMaskInstalled()) {
                        if (!window.ethereum.isMetaMask) {
                            console.warn(constants_1.OTHER_WALLET_EXTENSION_WARNING);
                        }
                        if (window.ethereum.isConnected()) {
                            onMetamask(config);
                            exports.state.provider = new providers_1.Web3Provider((await (0, detect_provider_1.default)()));
                            exports.state.signer = exports.state.provider?.getSigner() || {};
                            await window.ethereum.request(constants_1.RequestAccounts);
                            connected.next(true);
                            authorized.next((await window.ethereum.enable()).length > 0);
                            accounts.next(await window.ethereum.enable());
                            chainId.next(parseInt(window.ethereum.chainId, 16));
                            switchChain(config);
                        }
                        else {
                            throw new Error(constants_1.METAMASK_NOT_CONNECTED_ERROR);
                        }
                    }
                    else {
                        onboarding.startOnboarding();
                    }
                    break;
                case "walletconnect":
                    const provider = new index_min_js_1.default({
                        infuraId: config.infuraId,
                        rpc: {
                            56: "https://bsc-dataseed.binance.org",
                            43114: "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
                            137: "https://polygonapi.terminet.io/rpc",
                            25: "https://evm.cronos.org",
                            250: "https://rpc.ftm.tools",
                            42161: "https://arb1.arbitrum.io/rpc",
                            10: "https://mainnet.optimism.io",
                            8217: "https://cypress.fandom.finance/archive",
                            1313161554: "https://mainnet.aurora.dev", // Aurora Mainnet
                        },
                    });
                    onWalletConnect(provider);
                    await provider.enable();
                    connected.next(true);
                    chainId.next(provider.chainId);
                    exports.state.provider = new providers_1.Web3Provider(provider);
                    exports.state.signer = exports.state.provider.getSigner();
                    break;
                default:
                    throw new Error(constants_1.NO_MATCHING_CONNECTION_METHOD);
            }
        }
        catch (error) {
            connected.next(false);
            authorized.next(false);
            console.error(constants_1.INIT_ERROR, error);
        }
    };
    return {
        init,
        provider: exports.state.provider,
        signer: exports.state.signer,
        connected,
        authorized,
        accounts,
        chainId,
    };
};
exports.useWallet = useWallet;
//# sourceMappingURL=index.js.map