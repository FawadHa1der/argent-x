import type { AccountInterface, Provider, SignerInterface } from "starknet";
export declare type EventHandler = (accounts: string[]) => void;
interface WatchAssetParameters {
    type: "ERC20";
    options: {
        address: string;
        symbol?: string;
        decimals?: number;
        image?: string;
        name?: string;
    };
}
export declare type RpcMessage = {
    type: "wallet_watchAsset";
    params: WatchAssetParameters;
};
interface IStarketWindowObject {
    request: (call: RpcMessage) => Promise<void>;
    enable: (options?: {
        showModal?: boolean;
    }) => Promise<string[]>;
    isPreauthorized: () => Promise<boolean>;
    on: (event: "accountsChanged", handleEvent: EventHandler) => void;
    off: (event: "accountsChanged", handleEvent: EventHandler) => void;
    /**
     * @deprecated use `account` instead
     */
    signer?: SignerInterface;
    account?: AccountInterface;
    provider: Provider;
    selectedAddress?: string;
    version: string;
}
interface ConnectedStarketWindowObject extends IStarketWindowObject {
    isConnected: true;
    signer: SignerInterface;
    account: AccountInterface;
    selectedAddress: string;
}
interface DisconnectedStarketWindowObject extends IStarketWindowObject {
    isConnected: false;
}
export declare type StarknetWindowObject = ConnectedStarketWindowObject | DisconnectedStarketWindowObject;
declare global {
    interface Window {
        starknet?: StarknetWindowObject;
    }
}
export {};
