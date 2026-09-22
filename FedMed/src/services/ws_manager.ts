/**
 * FedMed Real-Time WebSocket Round Broadcast & State Synchronization Manager
 */

export interface BroadcastPayload {
  round: number;
  stage: 'SELECTION' | 'DISTRIBUTION' | 'LOCAL_TRAIN' | 'SECURE_AGGREGATION' | 'EVALUATION';
  activeNodes: number;
  globalDice: number;
  globalLoss: number;
  timestamp: string;
}

export class RoundSyncManager {
  private updateQueue: BroadcastPayload[] = [];
  private batchIntervalMs: number = 250;
  private timer: ReturnType<typeof setTimeout> | null = null;

  public queueUpdate(payload: BroadcastPayload, onFlush: (batch: BroadcastPayload[]) => void): void {
    this.updateQueue.push(payload);
    if (!this.timer) {
      this.timer = setTimeout(() => {
        const batch = [...this.updateQueue];
        this.updateQueue = [];
        this.timer = null;
        onFlush(batch);
      }, this.batchIntervalMs);
    }
  }

  public clear(): void {
    if (this.timer) clearTimeout(this.timer);
    this.updateQueue = [];
    this.timer = null;
  }
}
