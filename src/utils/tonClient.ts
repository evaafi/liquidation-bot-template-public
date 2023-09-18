import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

class SwitchableTonClient {
  private endpoints: string[];
  private currentEndpointIndex: number;
  private client: TonClient | null;

  constructor(endpoints: string[]) {
    this.endpoints = endpoints;
    this.currentEndpointIndex = 0;
    this.client = null;
    this.switchToNextEndpoint();
  }

  private async createTonClient(endpoint: string): Promise<TonClient | null> {
    try {
      const newClient = new TonClient({ endpoint });
      console.log(`Using endpoint: ${endpoint}`);
      return newClient;
    } catch (error: any) {
      console.error(`Endpoint ${endpoint} failed: ${error.message}`);
      return null;
    }
  }

  async switchToNextEndpoint() {
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    const newEndpoint = this.endpoints[this.currentEndpointIndex];
    const newClient = await this.createTonClient(newEndpoint);
    if (newClient) {
      this.client = newClient;
    }
  }

  async tonClient(): Promise<TonClient> {
    if (!this.client) {
      this.client = await this.createTonClient(this.endpoints[this.currentEndpointIndex]);
    }

    if (!this.client) {
      throw new Error("No available client");
    }

    return this.client;
  }

}

let switchableClient: SwitchableTonClient | null = null;

const initializeSwitchableClient = async () => {
  const ENDPOINTS = [
    await getHttpEndpoint({ network: "testnet" }),
    // 'https://tonrpc.sepezho.com/api/v2/jsonRPC', // our rpc but it does not responce on localhosts
  ];

  switchableClient = new SwitchableTonClient(ENDPOINTS);
};

export const getSwitchableClient = async (): Promise<SwitchableTonClient> => {
  if (!switchableClient) {
    await initializeSwitchableClient();
  }

  if (switchableClient === null) {
    throw new Error("Switchable client initialization failed");
  }

  return switchableClient;
};

export const getTonClient = async (): Promise<TonClient> => {
  const client = await getSwitchableClient();
  return client.tonClient();
};

