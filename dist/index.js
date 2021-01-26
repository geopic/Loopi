"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Loopi = /** @class */ (function () {
    /**
     * Initialise an active game loop.
     * @param options Options to pass -- see the
     * [API documentation](https://github.com/geopic/loopi) for details.
     */
    function Loopi(options) {
        if (options === void 0) { options = { ticksPerSecond: 1 }; }
        var _a;
        try {
            window;
        }
        catch (_b) {
            throw new Error("Note from Loopi:\n\nThis library is intended for use in a web browser (front-end) environment.\n\nIf you want to keep a Node script running continuously, use a process management tool like 'pm2' or 'forever'.");
        }
        this._options = options;
        this._paused = false;
        this._lastTime = 0;
        this._ticks = 0;
        this._ticksPerSecond = (_a = options === null || options === void 0 ? void 0 : options.ticksPerSecond) !== null && _a !== void 0 ? _a : 1;
        this._events = [];
        this._unpausedTimestamp = 0;
        this._unpausedLastTime = 0;
        this._unpausedDeltaTime = 0;
        this._unpausedTicks = 0;
        this._requestAnimationFrameId = window.requestAnimationFrame(this._update.bind(this));
    }
    Object.defineProperty(Loopi.prototype, "events", {
        /**
         * TODO: add documentation
         */
        get: function () {
            var self = this;
            return {
                add: function (e) {
                    self._events.push(tslib_1.__assign(tslib_1.__assign({}, e), { _isActive: false }));
                },
                get: function (i) {
                    return self._events[i];
                },
                getAll: function () {
                    return self._events;
                },
                remove: function (i) {
                    if (i === void 0) { i = 0; }
                    self._events.splice(i, 1);
                },
                removeAll: function () {
                    self._events = [];
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loopi.prototype, "stats", {
        /**
         * TODO: add documentation
         */
        get: function () {
            return {
                ticks: +this._ticks.toFixed(0),
                ticksExclPaused: +this._unpausedTicks.toFixed(0),
                ticksPerSecond: this._ticksPerSecond
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loopi.prototype, "utils", {
        /**
         * TODO: add documentation
         */
        get: function () {
            var self = this;
            return {
                changeTps: function (newTps) {
                    self._ticksPerSecond = newTps;
                    self._options.ticksPerSecond = newTps;
                },
                togglePauseState: function () {
                    self._paused = !self._paused;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Loopi.prototype._update = function (timestamp) {
        var e_1, _a;
        var deltaTime;
        if (this._lastTime > 0) {
            deltaTime = timestamp - this._lastTime;
            this._ticks += (this._ticksPerSecond * deltaTime) / 1000;
            this._unpausedTimestamp = this._paused
                ? this._unpausedTimestamp
                : timestamp;
            this._unpausedLastTime = this._paused
                ? this._unpausedLastTime
                : this._lastTime;
            this._unpausedDeltaTime = this._paused
                ? this._unpausedTimestamp - this._unpausedLastTime
                : deltaTime;
            this._unpausedTicks = this._paused
                ? this._unpausedTicks
                : this._unpausedTicks +
                    (this._ticksPerSecond * this._unpausedDeltaTime) / 1000;
        }
        this._lastTime = timestamp;
        try {
            for (var _b = tslib_1.__values(this._events), _c = _b.next(); !_c.done; _c = _b.next()) {
                var event_1 = _c.value;
                if (event_1.condition()) {
                    if (event_1._isActive && !event_1.runWhile) {
                        break;
                    }
                    event_1.action();
                    event_1._isActive = true;
                }
                else {
                    event_1._isActive = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._requestAnimationFrameId = window.requestAnimationFrame(this._update.bind(this));
    };
    /**
     * TODO: add documentation
     */
    Loopi.prototype.end = function () {
        window.cancelAnimationFrame(this._requestAnimationFrameId);
    };
    return Loopi;
}());
exports.default = Loopi;
