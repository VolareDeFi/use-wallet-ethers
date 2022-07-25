"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainID = exports.WalletType = void 0;
var WalletType;
(function (WalletType) {
    WalletType["Metamask"] = "metamask";
    WalletType["Ledger"] = "ledger";
    WalletType["Trezor"] = "trezor";
    WalletType["WalletConnect"] = "walletconnect";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
var ChainID;
(function (ChainID) {
    ChainID[ChainID["Mainnet"] = 1] = "Mainnet";
    ChainID[ChainID["Ropsten"] = 3] = "Ropsten";
    ChainID[ChainID["Rinkeby"] = 4] = "Rinkeby";
    ChainID[ChainID["Goerli"] = 5] = "Goerli";
    ChainID[ChainID["BSC"] = 56] = "BSC";
    ChainID[ChainID["BSCTestnet"] = 97] = "BSCTestnet";
    ChainID[ChainID["Fantom"] = 250] = "Fantom";
    ChainID[ChainID["FantomTestnet"] = 4002] = "FantomTestnet";
    ChainID[ChainID["Avalanche"] = 43114] = "Avalanche";
    ChainID[ChainID["Fuji"] = 43113] = "Fuji";
})(ChainID = exports.ChainID || (exports.ChainID = {}));
//# sourceMappingURL=types.js.map