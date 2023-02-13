declare const events: any;
declare class NativeMetricEmitter extends events.EventEmitter {
    private static GC_TYPES;
    private static DEFAULT_INTERVAL;
    private enabled;
    private _handle;
    private _loopProfiler;
    private _gcProfiler;
    private _resourceProfiler;
    constructor(options: any);
    enable(enable?: boolean, pollInterval?: number): void;
    getLoopData(): any;
    getGCData(): any;
    private _start;
    private _stop;
    private _emitUsage;
}
export = NativeMetricEmitter;
