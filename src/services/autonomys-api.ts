/**
 * Autonomys Network API Service
 * 
 * Handles connection to Autonomys Network and transaction submission
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { SelfCheckSummary } from '../lib/evm-signing';

// Autonomys Network endpoints
export const AUTONOMYS_ENDPOINTS = {
  mainnet: 'wss://rpc.mainnet.subspace.foundation/ws',
  testnet: 'wss://rpc.chronos.autonomys.xyz/ws', // Keep testnet for future use
} as const;

// Transaction timeout configuration (5 minutes)
export const TRANSACTION_TIMEOUT = 300000;

export type AutonomysNetwork = keyof typeof AUTONOMYS_ENDPOINTS;

export interface TransactionStatus {
  status: 'preparing' | 'signing' | 'submitting' | 'pending' | 'success' | 'error';
  message: string;
  hash?: string;
  blockHash?: string;
  error?: string;
}

export interface RemarkTransactionResult {
  hash: string;
  blockHash?: string;
  success: boolean;
  error?: string;
}

export class AutonomysApiService {
  private api: ApiPromise | null = null;
  private wsProvider: WsProvider | null = null;
  private isConnecting = false;
  private network: AutonomysNetwork = 'mainnet';

  constructor(network: AutonomysNetwork = 'mainnet') {
    this.network = network;
  }

  /**
   * Connect to the Autonomys Network
   */
  async connect(): Promise<ApiPromise> {
    if (this.api?.isConnected) {
      return this.api;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.api?.isConnected) {
        return this.api;
      }
    }

    this.isConnecting = true;

    try {
      // Disconnect existing provider if any
      if (this.wsProvider) {
        await this.wsProvider.disconnect();
      }

      // Create new WebSocket provider
      this.wsProvider = new WsProvider(AUTONOMYS_ENDPOINTS[this.network]);
      
      // Create API instance
      this.api = await ApiPromise.create({ 
        provider: this.wsProvider,
        throwOnConnect: true,
      });

      // Wait for the API to be ready
      await this.api.isReady;

      console.log(`Connected to Autonomys ${this.network} network`);
      return this.api;
    } catch (error) {
      console.error('Failed to connect to Autonomys network:', error);
      throw new Error(`Failed to connect to Autonomys ${this.network}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from the network
   */
  async disconnect(): Promise<void> {
    try {
      if (this.api) {
        await this.api.disconnect();
        this.api = null;
      }
      if (this.wsProvider) {
        await this.wsProvider.disconnect();
        this.wsProvider = null;
      }
      console.log('Disconnected from Autonomys network');
    } catch (error) {
      console.error('Error disconnecting from Autonomys network:', error);
    }
  }

  /**
   * Check if connected to the network
   */
  isConnected(): boolean {
    return this.api?.isConnected ?? false;
  }

  /**
   * Get network information
   */
  async getNetworkInfo(): Promise<{
    chain: string;
    nodeName: string;
    nodeVersion: string;
    network: AutonomysNetwork;
  }> {
    const api = await this.connect();
    
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

    return {
      chain: chain.toString(),
      nodeName: nodeName.toString(),
      nodeVersion: nodeVersion.toString(),
      network: this.network,
    };
  }

  /**
   * Submit a system.remark transaction with EVM address content
   */
  async submitRemarkTransaction(
    evmAddress: string,
    senderAddress: string,
    injector: InjectedExtension,
    onStatusUpdate?: (status: TransactionStatus) => void,
    selfCheckSummary?: SelfCheckSummary | null
  ): Promise<RemarkTransactionResult> {
    const api = await this.connect();

    // Update status
    onStatusUpdate?.({
      status: 'preparing',
      message: 'Preparing transaction...'
    });

    try {
      // Create the remark extrinsic with structured association content
      const nonce = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      // Build self-check status for the remark content
      let evmSelfCheck = 'not_performed';
      if (selfCheckSummary?.performed) {
        // For EOA: use match result; for Safe: always "matched" (owner signed successfully)
        if (selfCheckSummary.walletType === 'EOA') {
          evmSelfCheck = selfCheckSummary.matchesBeneficiary ? 'matched' : 'not_matched';
        } else {
          // Safe multisig: owner signed, which is the expected behavior
          evmSelfCheck = 'matched';
        }
      }
      
      const remarkContent = `SUBSPACE_ASSOC:v1
ss58=${senderAddress}
evm=${evmAddress}
evm_self_check=${evmSelfCheck}
scope=beneficiary
nonce=${nonce}
ts=${timestamp}`;
      const extrinsic = api.tx.system.remark(remarkContent);

      // Update status
      onStatusUpdate?.({
        status: 'signing',
        message: 'Please sign the transaction in your wallet...'
      });

      // Sign and submit the transaction
      const result = await this.signAndSubmitTransaction(
        extrinsic,
        senderAddress,
        injector,
        onStatusUpdate
      );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      onStatusUpdate?.({
        status: 'error',
        message: 'Transaction failed',
        error: errorMessage
      });

      throw new Error(`Failed to submit remark transaction: ${errorMessage}`);
    }
  }

  /**
   * Sign and submit a transaction
   */
  private async signAndSubmitTransaction(
    extrinsic: SubmittableExtrinsic<'promise'>,
    senderAddress: string,
    injector: InjectedExtension,
    onStatusUpdate?: (status: TransactionStatus) => void
  ): Promise<RemarkTransactionResult> {
    return new Promise((resolve, reject) => {
      let transactionHash: string | undefined;
      let hasResolved = false;
      let unsubscribe: (() => void) | undefined;

      const handleSubmit = async () => {
        try {
          unsubscribe = await extrinsic.signAndSend(
            senderAddress,
            { signer: injector.signer },
            (result: any) => {
              const { status, dispatchError } = result;

              // Get transaction hash
              if (result.txHash && !transactionHash) {
                transactionHash = result.txHash.toHex();
                
                onStatusUpdate?.({
                  status: 'submitting',
                  message: 'Transaction submitted to network...',
                  hash: transactionHash
                });
              }

              if (status.isInBlock) {
                // Check for dispatch errors first
                if (dispatchError) {
                  let errorMessage = 'Transaction failed';
                  
                  if (dispatchError.isModule) {
                    try {
                      const decoded = extrinsic.registry.findMetaError(dispatchError.asModule);
                      errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
                    } catch (error) {
                      console.error('Error decoding dispatch error:', error);
                    }
                  } else {
                    errorMessage = dispatchError.toString();
                  }

                  onStatusUpdate?.({
                    status: 'error',
                    message: 'Transaction failed',
                    error: errorMessage,
                    hash: transactionHash
                  });

                  if (!hasResolved) {
                    hasResolved = true;
                    if (unsubscribe) unsubscribe();
                    reject(new Error(errorMessage));
                  }
                } else {
                  // Transaction successful - included in block!
                  onStatusUpdate?.({
                    status: 'success',
                    message: 'Transaction confirmed in block!',
                    hash: transactionHash,
                    blockHash: status.asInBlock.toHex()
                  });

                  if (!hasResolved) {
                    hasResolved = true;
                    if (unsubscribe) unsubscribe();
                    resolve({
                      hash: transactionHash!,
                      blockHash: status.asInBlock.toHex(),
                      success: true
                    });
                  }
                }
              } else if (status.isFinalized) {
                // Optional: Add finalized status for additional confirmation
                // but don't change resolved state since we already resolved on isInBlock
                if (!dispatchError && hasResolved) {
                  onStatusUpdate?.({
                    status: 'success',
                    message: 'Transaction finalized on blockchain!',
                    hash: transactionHash,
                    blockHash: status.asFinalized.toHex()
                  });
                }
              } else if (status.isDropped || status.isInvalid || status.isUsurped) {
                const errorMessage = `Transaction ${status.type.toLowerCase()}`;
                
                onStatusUpdate?.({
                  status: 'error',
                  message: errorMessage,
                  error: errorMessage,
                  hash: transactionHash
                });

                if (!hasResolved) {
                  hasResolved = true;
                  if (unsubscribe) unsubscribe();
                  reject(new Error(errorMessage));
                }
              }
            }
          );
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to sign or submit transaction';
          
          onStatusUpdate?.({
            status: 'error',
            message: 'Transaction signing failed',
            error: errorMessage
          });

          if (!hasResolved) {
            hasResolved = true;
            reject(new Error(errorMessage));
          }
        }
      };

      // Start the submission process
      handleSubmit();

      // Set a timeout to prevent hanging
      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          if (unsubscribe) unsubscribe();
          reject(new Error('Transaction timeout after 5 minutes'));
        }
      }, TRANSACTION_TIMEOUT);
    });
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address: string): Promise<{
    free: string;
    reserved: string;
    total: string;
  }> {
    const api = await this.connect();
    
    const account = await api.query.system.account(address);
    const balance = (account as any).data;
    
    return {
      free: balance.free.toString(),
      reserved: balance.reserved.toString(),
      total: balance.free.add(balance.reserved).toString(),
    };
  }
}

// Singleton instance
let autonomysApiInstance: AutonomysApiService | null = null;

/**
 * Get the singleton Autonomys API service instance
 */
export function getAutonomysApi(network: AutonomysNetwork = 'mainnet'): AutonomysApiService {
  if (!autonomysApiInstance || autonomysApiInstance['network'] !== network) {
    autonomysApiInstance = new AutonomysApiService(network);
  }
  return autonomysApiInstance;
}

/**
 * Cleanup function to disconnect from the network
 */
export async function disconnectAutonomysApi(): Promise<void> {
  if (autonomysApiInstance) {
    await autonomysApiInstance.disconnect();
    autonomysApiInstance = null;
  }
}