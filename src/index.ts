import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import MetamaskOnboarding from "@metamask/onboarding";
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js";
import { Signer } from "ethers";
import { BehaviorSubject } from "rxjs";
import {
  AddEthereumChain,
  ADD_ETHEREUM_CHAIN_ERROR,
  INIT_ERROR,
  METAMASK_NOT_CONNECTED_ERROR,
  NO_MATCHING_CONNECTION_METHOD,
  OTHER_WALLET_EXTENSION_WARNING,
  RequestAccounts,
  SwitchChain,
} from "./constants";
import {
  Callbacks,
  ChainID,
  MetamaskConfig,
  RpcError,
  WalletConnectConfig,
  WalletState,
  WalletType,
} from "./types";

export const state: WalletState = {
  provider: null,
  signer: null,
};

export const useWallet = (
  wallet: WalletType,
  config: MetamaskConfig | WalletConnectConfig,
  callbacks: Callbacks
) => {
  const connected = new BehaviorSubject<boolean>(false);
  const authorized = new BehaviorSubject<boolean>(false);
  const chainId = new BehaviorSubject<number>(0);
  const accounts = new BehaviorSubject<string[]>([]);

  const switchChain = async (config: MetamaskConfig) => {
    try {
      await (window.ethereum as any).request(SwitchChain(config.id));
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await (window.ethereum as any).request(AddEthereumChain(config));
        } catch (addError) {
          console.error(ADD_ETHEREUM_CHAIN_ERROR, addError);
        }
      }
    }
  };

  const onMetamask = (config: MetamaskConfig) => {
    console.log(window.ethereum);
    (window.ethereum as any).on(
      "connect",
      ({ _chainId }: { _chainId: string }) => {
        console.log("connected", _chainId);
        if (callbacks.onConnect) callbacks.onConnect(_chainId);
        connected.next(true);
        chainId.next(parseInt(_chainId, 16));
        if (parseInt(_chainId, 16) !== config.id) {
          switchChain(config);
        }
      }
    );
    (window.ethereum as any).on("disconnect", (error: RpcError) => {
      if (callbacks.onDisconnect) callbacks.onDisconnect(error);
      connected.next(false);
      authorized.next(false);
    });
    (window.ethereum as any).on(
      "accountsChanged",
      (_accounts: Array<string>) => {
        if (callbacks.onAccountsChanged) callbacks.onAccountsChanged(_accounts);
        accounts.next(_accounts);
        authorized.next(_accounts.length !== 0);
      }
    );
    (window.ethereum as any).on("chainChanged", (_chainId: string) => {
      if (callbacks.onChainChanged) callbacks.onChainChanged(_chainId);
      connected.next(true);
      chainId.next(parseInt(_chainId, 16));
      if (parseInt(_chainId, 16) !== config.id) {
        switchChain(config);
      }
    });
  };

  const onWalletConnect = (provider: WalletConnectProvider) => {
    provider.on("accountsChanged", (addresses: string[]) => {
      console.log(addresses);
      if (addresses.length > 0) {
        authorized.next(true);
        accounts.next(addresses);
      } else {
        authorized.next(false);
        accounts.next([]);
      }

      if (callbacks.onAccountsChanged) callbacks.onAccountsChanged(addresses);
    });

    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
      if (callbacks.onChainChanged)
        callbacks.onChainChanged(chainId.toString(16));
    });

    provider.on("disconnect", (code: number, reason: string) => {
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
          const onboarding = new MetamaskOnboarding();
          if (MetamaskOnboarding.isMetaMaskInstalled()) {
            if (!(window.ethereum as any).isMetaMask) {
              console.warn(OTHER_WALLET_EXTENSION_WARNING);
            }

            if ((window.ethereum as any).isConnected()) {
              onMetamask(config as MetamaskConfig);
              state.provider = new Web3Provider(
                (await detectEthereumProvider()) as ExternalProvider
              );
              state.signer = state.provider?.getSigner() || {};

              await (window.ethereum as any).request(RequestAccounts);

              connected.next(true);
              authorized.next(
                (await (window.ethereum as any).enable()).length > 0
              );
              accounts.next(await (window.ethereum as any).enable());
              chainId.next(parseInt((window.ethereum as any).chainId, 16));
              switchChain(config as MetamaskConfig);
            } else {
              throw new Error(METAMASK_NOT_CONNECTED_ERROR);
            }
          } else {
            onboarding.startOnboarding();
          }
          break;
        case "walletconnect":
          const provider = new WalletConnectProvider({
            infuraId: (config as WalletConnectConfig).infuraId,
            rpc: {
              56: "https://bsc-dataseed.binance.org", // BSC
              43114: "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc", // AVAX-C
              137: "https://polygonapi.terminet.io/rpc", // Polygon
              25: "https://evm.cronos.org", // Cronos
              250: "https://rpc.ftm.tools", // Fantom
              42161: "https://arb1.arbitrum.io/rpc", // Arbitrum
              10: "https://mainnet.optimism.io", // Optimism
              8217: "https://cypress.fandom.finance/archive", // Klaytn Mainnet Cypress
              1313161554: "https://mainnet.aurora.dev", // Aurora Mainnet
            },
          });

          onWalletConnect(provider);

          await provider.enable();
          connected.next(true);
          chainId.next(provider.chainId);

          state.provider = new Web3Provider(provider);
          state.signer = state.provider.getSigner();

          break;
        default:
          throw new Error(NO_MATCHING_CONNECTION_METHOD);
      }
    } catch (error) {
      connected.next(false);
      authorized.next(false);
      console.error(INIT_ERROR, error);
    }
  };

  return {
    init,
    provider: state.provider,
    signer: state.signer,
    connected,
    authorized,
    accounts,
    chainId,
  };
};

export { Web3Provider, Signer, ChainID, WalletType };
