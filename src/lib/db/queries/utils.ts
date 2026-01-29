export function firstOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }
  return items[0];
}


export function firstOrThrow<T>(items: T[]) {
    const item = firstOrUndefined(items);
    if (!item) {
      throw new Error("No items found");
    }
    return item;
  }