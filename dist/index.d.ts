/**
 * An _event_ in Loopi is an occurrence that is triggered in regular intervals
 * by the game loop. This is represented by an object which has three
 * properties: `condition`, `action` and `runWhile`.
 */
declare type LoopiEvent = {
    /**
     * A function which returns a condition, i.e. anything which evaluates to a
     * boolean value.
     * @example
     *
     * ```ts
     * const loop = loopi();
     *
     * loop.addEvent({
     *   // For every 5 ticks of active (unpaused) game time...
     *   condition: () => loop.stats.ticksExclPaused % 5 === 0,
     * ```
     */
    condition: () => boolean;
    /**
     * A function which runs the code inside it every time the `condition`
     * function returns `true`.
     * @example
     *
     * ```ts
     *   // ...make the main character self-combust.
     *   action: () => goodGuy.explodeIntoFlames(),
     * ```
     */
    action: () => void;
    /**
     * A simple and optional boolean which decides how the game loop should treat
     * the event. If set to `true`, this event is treated like a (do-)while loop:
     * "while _condition_, do _action_". `false` by default, so the action only
     * runs _once_ when the condition is met.
     * @example
     *
     *   // Once is enough.
     *   runWhile: false
     * });
     */
    runWhile?: boolean;
    _isActive: boolean;
};
/**
 * These are the options which are passed to the constructor.
 */
declare type LoopiOptions = {
    /**
     * The `n` number used in `Math.floor(Math.random() * n)` to define the top
     * range of random numbers generated in every tick of the game loop.
     * @default 101
     *
     * @example
     * ```ts
     * import loopi from "loopi";
     *
     * // A random number (from 0 to 50) will be generated with every tick
     * const loop = loopi({ randomNumberCeiling: 51 });
     * ```
     */
    randomNumberCeiling: number;
    /**
     * The number of _ticks_ that occur for every second of real-world time.
     * @default 1
     *
     * @example
     * ```ts
     * import loopi from "loopi";
     *
     * // This allows you to check for events every 1/5 (fifth) of a second
     * const loop = loopi({ ticksPerSecond: 5 });
     * ```
     */
    ticksPerSecond: number;
};
declare class LoopiClass {
    private _options;
    private _requestAnimationFrameId;
    private _paused;
    private _randNum;
    private _lastTime;
    private _ticks;
    private _ticksPerSecond;
    private _events;
    private _unpausedTimestamp;
    private _unpausedLastTime;
    private _unpausedDeltaTime;
    private _unpausedTicks;
    constructor(options?: Partial<LoopiOptions>);
    private _update;
    /**
     * TODO: write documentation
     */
    get randNum(): number;
    /**
     * The stats object for this Loopi instance, see the [API documentation](https://github.com/geopic/loopi)
     * for details.
     */
    get stats(): {
        /**
         * TODO: write documentation
         */
        ticks: number;
        /**
         * TODO: write documentation
         */
        ticksUnpaused: number;
        /**
         * TODO: write documentation
         */
        tps: number;
    };
    /**
     * Add a new event object to the game loop. Refer to the
     * [API documentation](https://github.com/geopic/loopi) for details.
     */
    addEvent(event: Omit<LoopiEvent, '_isActive'>): void;
    /**
     * Retrieve the object representation of a particular event from the
     * (zero-indexed) collection of Loopi events.
     */
    getEvent(index: number): Omit<LoopiEvent, '_isActive'>;
    /**
     * Retrieve all Loopi events in standard array form.
     */
    getEventAll(): Omit<LoopiEvent, '_isActive'>[];
    /**
     * Remove a particular event at a specific index from the (zero-indexed)
     * collection of Loopi events. It is advisable to retrieve the array of
     * events with `getEventAll` first to check which event belongs at which
     * position.
     * @param index The position of the event to remove.
     */
    removeEvent(index: number): void;
    /**
     * Remove all events from the loop.
     */
    removeEventAll(): void;
    /**
     * Set the game to a paused state.
     */
    pauseGame(): void;
    /**
     * Set the game to a resumed (unpaused) state.
     */
    resumeGame(): void;
    /**
     * Change the rate of ticks that pass in every real-world second.
     * @param newTicksPerSecond The new rate of ticks per second.
     */
    changeTps(newTicksPerSecond: number): void;
    /**
     * Terminate the game loop.
     *
     * **WARNING:** This ends the game loop _permanently_, so you won't be able to
     * use the same instance of `loopi` again. To simply _pause_ the game
     * (which is what you want in most cases, since it won't kill its loop
     * _completely_), please use the `pauseGame` method.
     */
    endLoop(): void;
}
/**
 * Initialise an active game loop with an API to add 'events' (occurrences or
 * 'checks' per game tick).
 * @param [options] Options to pass. See the [API documentation](https://github.com/geopic/loopi) for details.
 */
export default function loopi(options?: Partial<LoopiOptions>): LoopiClass;
export {};
