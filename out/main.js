"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var events = require("events");
var natives = require("../build/Release/native_metrics.node");
var NativeMetricEmitter = /** @class */ (function (_super) {
    __extends(NativeMetricEmitter, _super);
    function NativeMetricEmitter(options) {
        var _this = _super.call(this, options) || this;
        options = options || { timeout: NativeMetricEmitter.DEFAULT_INTERVAL };
        _this.enabled = false;
        _this._handle = null;
        _this._loopProfiler = new natives.LoopProfiler();
        _this._gcProfiler = new natives.GcProfiler();
        _this._resourceProfiler = new natives.ResourceProfiler();
        _this.enable(true, options.timeout);
        return _this;
    }
    NativeMetricEmitter.prototype.enable = function (enable, pollInterval) {
        if (enable === void 0) { enable = true; }
        if (enable) {
            this._start(pollInterval);
        }
        else {
            this._stop();
        }
    };
    NativeMetricEmitter.prototype.getLoopData = function () {
        return this._loopProfiler.data();
    };
    NativeMetricEmitter.prototype.getGCData = function () {
        var gcMetrics = this._gcProfiler.data();
        var results = Object.create(null);
        for (var typeId in gcMetrics) {
            if (gcMetrics.hasOwnProperty(typeId) && gcMetrics[typeId].count > 0) {
                var typeName = NativeMetricEmitter.GC_TYPES[typeId];
                results[typeName] = {
                    typeId: parseInt(typeId, 10),
                    type: typeName,
                    metrics: gcMetrics[typeId]
                };
            }
        }
        return results;
    };
    NativeMetricEmitter.prototype._start = function (pollInterval) {
        if (this.enabled) {
            return;
        }
        var interval = pollInterval || NativeMetricEmitter.DEFAULT_INTERVAL;
        this._gcProfiler.start();
        this._loopProfiler.start();
        this._handle = setTimeout(this._emitUsage.bind(this, interval), interval);
        this._handle.unref();
        this.enabled = true;
    };
    NativeMetricEmitter.prototype._stop = function () {
        if (!this.enabled) {
            return;
        }
        this._gcProfiler.stop();
        this._loopProfiler.stop();
        clearTimeout(this._handle);
        this._handle = null;
        this.enabled = false;
    };
    NativeMetricEmitter.prototype._emitUsage = function (interval) {
        if (this._resourceProfiler) {
            this.emit("usage", this._resourceProfiler.read());
        }
        if (this.enabled) {
            // Stop timer when disabled
            this._handle = setTimeout(this._emitUsage.bind(this, interval), interval);
            this._handle.unref();
        }
    };
    NativeMetricEmitter.GC_TYPES = {
        1: "Scavenge",
        2: "MarkSweepCompact",
        3: "All",
        4: "IncrementalMarking",
        8: "ProcessWeakCallbacks",
        15: "All" // For > node4
    };
    NativeMetricEmitter.DEFAULT_INTERVAL = 15000;
    return NativeMetricEmitter;
}(events.EventEmitter));
module.exports = NativeMetricEmitter;
//# sourceMappingURL=main.js.map