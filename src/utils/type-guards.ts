/**
 * Type guard to ensure the value is not undefined.
 */
export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return typeof value !== "undefined";
}
