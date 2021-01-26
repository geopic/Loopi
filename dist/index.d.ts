/**
 * An _event_ in Loopi is an occurrence that is triggered in regular intervals
 * by the game loop. This is represented by an object which has three
 * properties: `condition`, `action` and `runWhile`.
 */
declare type LoopiEvent = {
    /**
     * A function which returns a condition, i.e. anything which evaluates to a
     * boolean value.
     *
     * @example
     * ```ts
     * const loop = new Loopi();
     *
     * loop.addEvent({
     *   // For every 5 ticks of active game time...
     *   condition: () => loop.stats.ticksExclPaused % 5 === 0,
     * ```
     */
    condition: () => boolean;
    /**
     * A function which runs the code inside it every time the `condition`
     * function returns `true`.
     *
     * @example
     * ```ts
     *   // ...make the main character self-combust.
     *   action: () => goodGuy.explodeIntoFlames(),
     * ```
     */
    action: () => void;
    /**
     * A simple boolean which decides how the game loop should treat the event.
     * If set to `true`, this event is treated like a (do-)while loop: "while
     * _condition_, do _action_". `false` by default, so the action only runs
     * _once_ when the condition is met.
     *
     * @example
     *   // Once is enough.
     *   runWhile: false
     * });
     */
    runWhile: boolean;
};
/**
 * These are the options which are passed to the constructor.
 */
declare type LoopiOptions = Partial<{
    /**
     * Set a custom number of _ticks_ that occur for every second of real-world
     * time.
     * @default 1
     *
     * @example
     * ```ts
     * import Loopi from "loopi";
     *
     * // This allows you to check for events every 1/5 (fifth) of a second
     * const loop = new Loopi({ ticksPerSecond: 5 });
     * ```
     */
    ticksPerSecond: number;
}>;
/**
 * These are the statistics for the loop, useful for checking how many ticks
 * have passed and/or for debugging.
 */
declare type LoopiStats = {
    /**
     * The amount of ticks that have occurred in the game loop since
     * initialisation. Use `ticksExclPaused` if you want to measure ticks for
     * event conditions, since this number increments whether the game is paused
     * or not.
     */
    ticks: number;
    /**
     * The amount of ticks that have occurred in the game loop while the game has
     * been in an 'unpaused' state. Use this in event conditions when you want
     * something to be checked every _n_ ticks.
     */
    ticksExclPaused: number;
    /**
     * The amount of ticks that occur in every real-world second. If not set when
     * the class was instantiated, then its default is `1`.
     */
    ticksPerSecond: number;
};
interface LoopiEventMethods {
    /**
     * TODO: add documentation
     */
    add: (event: LoopiEvent) => void;
    /**
     * TODO: add documentation
     */
    get: (index: number) => LoopiEvent;
    /**
     * TODO: add documentation
     */
    getAll: () => LoopiEvent[];
    /**
     * TODO: add documentation
     */
    remove: (index: number) => void;
    /**
     * TODO: add documentation
     */
    removeAll: () => void;
}
interface LoopiOptionMethods {
    /**
     * TODO: add documentation
     */
    changeTps: (newTicksPerSecond: number) => void;
    /**
     * TODO: add documentation
     */
    togglePauseState: () => void;
}
export default class Loopi {
    private _options;
    private _requestAnimationFrameId;
    private _paused;
    private _lastTime;
    private _ticks;
    private _ticksPerSecond;
    private _events;
    private _unpausedTimestamp;
    private _unpausedLastTime;
    private _unpausedDeltaTime;
    private _unpausedTicks;
    /**
     * Initialise an active game loop.
     * @param options Options to pass -- see the
     * [API documentation](https://github.com/geopic/loopi) for details.
     */
    constructor(options?: LoopiOptions);
    /**
     * TODO: add documentation
     */
    get events(): LoopiEventMethods;
    /**
     * TODO: add documentation
     */
    get stats(): LoopiStats;
    /**
     * TODO: add documentation
     */
    get utils(): LoopiOptionMethods;
    private _update;
    /**
     * TODO: add documentation
     */
    end(): void;
}
export {};
