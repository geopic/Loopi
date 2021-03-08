"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var LoopiClass = /** @class */ (function () {
    function LoopiClass(options) {
        try {
            window;
        }
        catch (_a) {
            throw new Error("Note from Loopi:\n\nThis library is intended for use in a web browser (front-end) environment.\n\nIf you want to keep a Node script running continuously, use a process management tool like 'pm2' or 'forever'.");
        }
        this._options = Object.assign({ randomNumberCeiling: 101, ticksPerSecond: 1 }, options);
        this._paused = false;
        this._randNum = Math.floor(Math.random() * this._options.randomNumberCeiling);
        this._lastTime = 0;
        this._ticks = 0;
        this._ticksPerSecond = this._options.ticksPerSecond;
        this._events = [];
        this._unpausedTimestamp = 0;
        this._unpausedLastTime = 0;
        this._unpausedDeltaTime = 0;
        this._unpausedTicks = 0;
        this._requestAnimationFrameId = window.requestAnimationFrame(this._update.bind(this));
    }
    LoopiClass.prototype._update = function (timestamp) {
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
                if (event_1.condition() && !this._paused) {
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
        this._randNum = Math.floor(Math.random() * this._options.randomNumberCeiling);
        this._requestAnimationFrameId = window.requestAnimationFrame(this._update.bind(this));
    };
    Object.defineProperty(LoopiClass.prototype, "randNum", {
        /**
         * TODO: write documentation
         */
        get: function () {
            return this._randNum;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoopiClass.prototype, "stats", {
        /**
         * The stats object for this Loopi instance, see the [API documentation](https://github.com/geopic/loopi)
         * for details.
         */
        get: function () {
            return {
                /**
                 * TODO: write documentation
                 */
                ticks: this._ticks,
                /**
                 * TODO: write documentation
                 */
                ticksUnpaused: this._unpausedTicks,
                /**
                 * TODO: write documentation
                 */
                tps: this._ticksPerSecond
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add a new event object to the game loop. Refer to the
     * [API documentation](https://github.com/geopic/loopi) for details.
     */
    LoopiClass.prototype.addEvent = function (event) {
        if (event.runWhile === undefined) {
            event.runWhile = false;
        }
        this._events.push(tslib_1.__assign(tslib_1.__assign({}, event), { _isActive: false }));
    };
    /**
     * Retrieve the object representation of a particular event from the
     * (zero-indexed) collection of Loopi events.
     */
    LoopiClass.prototype.getEvent = function (index) {
        return this._events[index];
    };
    /**
     * Retrieve all Loopi events in standard array form.
     */
    LoopiClass.prototype.getEventAll = function () {
        return this._events;
    };
    /**
     * Remove a particular event at a specific index from the (zero-indexed)
     * collection of Loopi events. It is advisable to retrieve the array of
     * events with `getEventAll` first to check which event belongs at which
     * position.
     * @param index The position of the event to remove.
     */
    LoopiClass.prototype.removeEvent = function (index) {
        this._events.splice(index, 1);
    };
    /**
     * Remove all events from the loop.
     */
    LoopiClass.prototype.removeEventAll = function () {
        this._events = [];
    };
    /**
     * Set the game to a paused state.
     */
    LoopiClass.prototype.pauseGame = function () {
        this._paused = true;
    };
    /**
     * Set the game to a resumed (unpaused) state.
     */
    LoopiClass.prototype.resumeGame = function () {
        this._paused = false;
    };
    /**
     * Change the rate of ticks that pass in every real-world second.
     * @param newTicksPerSecond The new rate of ticks per second.
     */
    LoopiClass.prototype.changeTps = function (newTicksPerSecond) {
        this._options.ticksPerSecond = newTicksPerSecond;
    };
    /**
     * Terminate the game loop.
     *
     * **WARNING:** This ends the game loop _permanently_, so you won't be able to
     * use the same instance of `loopi` again. To simply _pause_ the game
     * (which is what you want in most cases, since it won't kill its loop
     * _completely_), please use the `pauseGame` method.
     */
    LoopiClass.prototype.endLoop = function () {
        window.cancelAnimationFrame(this._requestAnimationFrameId);
    };
    return LoopiClass;
}());
/**
 * Initialise an active game loop with an API to add 'events' (occurrences or
 * 'checks' per game tick).
 * @param [options] Options to pass. See the [API documentation](https://github.com/geopic/loopi) for details.
 */
function loopi(options) {
    if (options === void 0) { options = {}; }
    return new LoopiClass(options);
}
exports.default = loopi;
