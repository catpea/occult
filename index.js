class Signal {
  static Symbol = Symbol("Signal");
  #value;
  #subscribers;

  constructor(value) {
    this.#value = value;
    this.#subscribers = new Set();
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    if (Object.is(newValue, this.#value)) return;
    this.#value = newValue;
    this.notify();
  }

  /**
   * Manually trigger all subscribers without changing the value
   * Useful when the object's internal state changes (mutations)
   */
  notify() {
    for (const callback of this.#subscribers) {
      callback(this.#value);
    }
  }

  subscribe(callback) {
    if (this.#value !== undefined) callback(this.#value);
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }
}

/**
 * Reactive Object that extends native Object with Signal-based reactivity.
 *
 * Features:
 * - Automatically notifies subscribers when any property changes
 * - Preserves natural object syntax (obj.prop = value)
 * - Ignores private properties (starting with _)
 * - Shallow reactivity (nested objects aren't automatically reactive)
 *
 * @example
 * const user = new Obj({ name: 'Alice', age: 30 });
 *
 * const unsub = user.subscribe(obj => {
 *   console.log('User changed:', obj);
 * });
 *
 * user.name = 'Bob'; // Triggers notification
 * user._private = 'ignored'; // No notification (private property)
 */
export class Obj {
  constructor(data, options) {
    // Create internal signal for this object
    // The signal's value is the object itself (not a copy)
    const signal = new Signal(this, options);

    // Store the signal using a symbol to avoid naming conflicts
    // and to keep it non-enumerable
    const signalSymbol = Signal.Symbol;

    // Create a proxy to intercept property assignments
    const proxy = new Proxy(this, {
      /**
       * Intercept property assignments
       * Notifies subscribers when non-private properties change
       */
      set(target, prop, value, receiver) {
        // Check if this is a real change
        const oldValue = target[prop];
        const hasChanged = !Object.is(value, oldValue);

        // Always perform the assignment
        const result = Reflect.set(target, prop, value, receiver);

        // Notify if:
        // 1. The value actually changed
        // 2. It's not a private property (starting with _)
        // 3. It's not the signal itself
        if (hasChanged && typeof prop === "string" && !prop.startsWith("_") && prop !== signalSymbol) {
          signal.notify();
        }

        return result;
      },

      /**
       * Intercept property deletions
       * Notifies subscribers when properties are deleted
       */
      deleteProperty(target, prop) {
        // Check if property exists (deletion would cause a change)
        const exists = prop in target;

        // Perform the deletion
        const result = Reflect.deleteProperty(target, prop);

        // Notify if a non-private property was actually deleted
        if (result && exists && typeof prop === "string" && !prop.startsWith("_")) {
          signal.notify();
        }

        return result;
      },

      /**
       * Intercept property access
       * This ensures the signal symbol returns the actual signal
       */
      get(target, prop, receiver) {
        if (prop === signalSymbol) {
          return signal;
        }
        return Reflect.get(target, prop, receiver);
      },

      /**
       * Make sure Object.keys() doesn't show the signal
       */
      ownKeys(target) {
        return Object.keys(target).filter((key) => key !== signalSymbol);
      },

      /**
       * Hide the signal property from enumeration
       */
      getOwnPropertyDescriptor(target, prop) {
        if (prop === signalSymbol) {
          return undefined; // Hide the signal
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
    });

    // Store the signal directly (not through proxy to avoid notification)
    this[signalSymbol] = signal;

    // Initialize with data if provided
    if (data) {
      Object.assign(proxy, data);
    }

    return proxy;
  }

  /**
   * Subscribe to changes on this object
   *
   * @param {Function} callback - Function called with the object when it changes
   * @returns {Function} Unsubscribe function
   *
   * @example
   * const unsub = obj.subscribe(o => console.log('Changed:', o));
   * obj.name = 'New Name'; // Triggers callback
   * unsub(); // Stop listening
   */
  subscribe(callback) {
    return this[Signal.Symbol].subscribe(callback);
  }

  /**
   * Manually trigger notifications to all subscribers
   * Useful when making multiple changes and wanting to batch notify
   *
   * @example
   * obj._updating = true; // Private flag, no notification
   * obj.x = 10;
   * obj.y = 20;
   * obj.notify(); // Single notification for both changes
   */
  notify() {
    this[Signal.Symbol].notify();
  }
}

/**
 * Reactive Array that extends native Array with Signal-based reactivity.
 *
 * Features:
 * - Automatically notifies subscribers when array changes (push, pop, splice, etc.)
 * - Notifies on index assignments (arr[0] = 'new')
 * - Notifies on length changes
 * - Preserves all native Array methods and behaviors
 * - Compatible with for...of, map, filter, and all array operations
 *
 * @example
 * const list = new Arr([1, 2, 3]);
 *
 * const unsub = list.subscribe(arr => {
 *   console.log('Array changed:', [...arr]);
 * });
 *
 * list.push(4);        // Triggers notification
 * list[0] = 'changed'; // Triggers notification
 * list.length = 2;     // Triggers notification
 */
export class Arr extends Array {
  constructor(data, options) {
    // Initialize as a normal array
    if (data) {
      super(...data);
    } else {
      super();
    }

    // Create internal signal for this array
    // The signal's value is the array itself
    const signal = new Signal(this, options);

    // Store the signal using a symbol
    const signalSymbol = Signal.Symbol;

    // Mutating array methods that should trigger notifications
    const mutatingMethods = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "copyWithin"];

    // Create a proxy to intercept array operations
    const proxy = new Proxy(this, {
      /**
       * Intercept property assignments
       * This handles: arr[0] = value, arr.length = value, etc.
       */
      set(target, prop, value, receiver) {
        const oldValue = target[prop];
        const oldLength = target.length;

        // Perform the assignment
        const result = Reflect.set(target, prop, value, receiver);

        // Check if we should notify
        let shouldNotify = false;

        // Check for numeric index changes (including new indices)
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
          const index = parseInt(prop, 10);
          // Notify if it's a valid array index and the value changed
          if (index >= 0 && !Object.is(value, oldValue)) {
            shouldNotify = true;
          }
        }

        // Check for length changes
        if (prop === "length" && oldLength !== value) {
          shouldNotify = true;
        }

        // Don't notify for the signal itself or private properties
        if (prop === signalSymbol || (typeof prop === "string" && prop.startsWith("_"))) {
          shouldNotify = false;
        }

        if (shouldNotify) {
          signal.notify();
        }

        return result;
      },

      /**
       * Intercept property access
       * This wraps mutating methods to trigger notifications
       */
      get(target, prop, receiver) {
        // Return the signal if requested
        if (prop === signalSymbol) {
          return signal;
        }

        const value = Reflect.get(target, prop, receiver);

        // Wrap mutating array methods
        if (mutatingMethods.includes(prop) && typeof value === "function") {
          return function (...args) {
            // Store old state for comparison
            const oldLength = target.length;
            const oldString = target.toString();

            // Call the original method
            const result = value.apply(this, args);

            // Check if anything actually changed
            // (some operations like push() with no args don't change anything)
            const hasChanged = target.length !== oldLength || target.toString() !== oldString;

            if (hasChanged) {
              signal.notify();
            }

            return result;
          };
        }

        return value;
      },

      /**
       * Intercept property deletions
       * Handles: delete arr[0]
       */
      deleteProperty(target, prop) {
        // Check if property exists
        const exists = prop in target;

        // Perform the deletion
        const result = Reflect.deleteProperty(target, prop);

        // Notify if a numeric index was deleted
        if (result && exists && typeof prop === "string" && /^\d+$/.test(prop)) {
          signal.notify();
        }

        return result;
      },

      /**
       * Hide the signal from iteration and enumeration
       */
      ownKeys(target) {
        return Reflect.ownKeys(target).filter((key) => key !== signalSymbol);
      },

      /**
       * Hide the signal property from property descriptors
       */
      getOwnPropertyDescriptor(target, prop) {
        if (prop === signalSymbol) {
          return undefined;
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },

      /**
       * Make sure the signal property is not enumerable
       */
      has(target, prop) {
        if (prop === signalSymbol) {
          return false;
        }
        return Reflect.has(target, prop);
      },
    });

    // Store the signal directly
    this[signalSymbol] = signal;

    return proxy;
  }

  /**
   * Subscribe to changes on this array
   *
   * @param {Function} callback - Function called with the array when it changes
   * @returns {Function} Unsubscribe function
   *
   * @example
   * const unsub = arr.subscribe(a => console.log('Changed:', [...a]));
   * arr.push(4); // Triggers callback
   * unsub(); // Stop listening
   */
  subscribe(callback) {
    return this[Signal.Symbol].subscribe(callback);
  }

  /**
   * Manually trigger notifications to all subscribers
   * Useful for complex operations or when modifying nested objects
   *
   * @example
   * arr[0].nested = 'value'; // Doesn't auto-notify (nested change)
   * arr.notify(); // Manual notification
   */
  notify() {
    this[Signal.Symbol].notify();
  }
}
