# 👛 use-wallet-ethers [WIP]

This repository is inspired by another useWallet library. But with some minor differences.

## Usage

The usage of this library is easy. We exported several useful functions from the `useWallet()` method.

```typescript
// JavaScript
const { init, provider, signer, accounts, connected, authorized } = useWallet(
  "metamask",
  {
    ...options,
  },
  {
    onConnect: (chainId) => console.log(chainId),
    onDisconnect: (error) => console.error(error),
    onAccountsChanged: (accounts) => console.log(accounts),
    onChainChanged: (chainId) => console.log(chainId),
  }
);

// TypeScript
const { init, provider, signer, accounts, connected, authorized } = useWallet(
  WalletType.Metamask,
  {
    ...options,
  },
  {
    onConnect: (chainId: string) => console.log(chainId),
    onDisconnect: (error: rpcError) => console.error(error),
    onAccountsChanged: (accounts: string[]) => console.log(accounts),
    onChainChanged: (chainId: string) => console.log(chainId),
  }
);
```

We also support typescript, there are numerous enums and type definitions inside the library.

For now, we support `Metamask` and `WalletConnect`. The first-tier support is **Metamask**.

## Best Practise

We recommend using the library along with the `TypeScript` programming language. The strongly typed data type of the language makes using the language much easier.

Beside the provider and signer, the rest of the items returned by useWallet is actually `BehaviorSubject.subscribe`. It is a reactive subject from `rxjs` and brings great reactive power to the metrics. Learn more [click here](https://rxjs.dev/guide/subject#behaviorsubject).

`subscribe` is a callback function. It will be called in the first time run and everytime the value changes. It is recommended to put the set function of the state management you use inside this callback function.

There are a few things worth noticing during the use:

- The `init(...args[])` function returns a Promise, and the return is void. We have handled all the possible errors but you will still have to handle the promise itself with care.
- We are using `ethers.js` for the underlying provider and signer, after the initialization, we will mount numerous objects onto the window objects. Theoretically, you can directly access the object with snippets like `window.provider` or `window.signer`. As for guidance on how to use the provider/signer, check them from the [Ethers.js Documentation](https://docs.ethers.io/v5/).
- The location of the initialization procedure is better to be placed in an early stage of your project. Or you might encounter problems like errors while invoke the provider functions.
- We don't persist any data into cookies or local storage. If the need for persistence is important, you can submit a PR or process by yourself.
