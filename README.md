# occult
Painfully Powerful Reactive Array and Object

```JavaScript

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

```
