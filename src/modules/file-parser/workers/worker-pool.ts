import { Worker } from 'worker_threads';
import path from 'path';
import * as fs from 'fs';

export class WorkerPool {
    private workers: Worker[] = [];
    private queue: Array<{ resolve: Function; reject: Function; data: any }> = [];
    private readonly maxWorkers: number;
    private readonly workerPath: string;

    constructor(maxWorkers: number = 4) {
        this.maxWorkers = maxWorkers;
        // In production (dist), use compiled .js; in development, use source
        const distPath = path.join(__dirname, 'batch-validation-worker.js');
        const srcPath = path.join(process.cwd(), 'src/module/file-parser/workers/batch-validation-worker.js');
        
        this.workerPath = fs.existsSync(distPath) ? distPath : srcPath;
    }

    async execute(data: any): Promise<{ validRows: any[]; invalidRows: Array<{ rowIndex: number; row: any; errors: string[] }> }> {
        return new Promise((resolve, reject) => {
            const availableWorker = this.workers.find(w => !w['busy']);
            
            if (availableWorker) {
                this.runTask(availableWorker, data, resolve, reject);
            } else if (this.workers.length < this.maxWorkers) {
                const worker = new Worker(this.workerPath);
                this.workers.push(worker);
                this.runTask(worker, data, resolve, reject);
            } else {
                this.queue.push({ resolve, reject, data });
            }
        });
    }

    private runTask(worker: Worker, data: any, resolve: Function, reject: Function) {
        worker['busy'] = true;
        
        const onMessage = (result: { validRows: any[]; invalidRows: Array<{ rowIndex: number; row: any; errors: string[] }> }) => {
            worker.off('message', onMessage);
            worker.off('error', onError);
            worker['busy'] = false;
            resolve(result);
            this.processQueue();
        };
        
        const onError = (error: Error) => {
            worker.off('message', onMessage);
            worker.off('error', onError);
            worker['busy'] = false;
            reject(error);
            this.processQueue();
        };
        
        worker.on('message', onMessage);
        worker.on('error', onError);
        worker.postMessage(data);
    }

    private processQueue() {
        if (this.queue.length > 0) {
            const availableWorker = this.workers.find(w => !w['busy']);
            if (availableWorker) {
                const { resolve, reject, data } = this.queue.shift()!;
                this.runTask(availableWorker, data, resolve, reject);
            }
        }
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
    }
}