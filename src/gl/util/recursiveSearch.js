export function recursiveSearch(object, field) {
  const tokens = field.split(".");
  let current = object;
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (!(token in current)) {
      throw new Error(`${token} is not found in settings.${field}!`);
    }
    current = current[token];
  }
  return current;
}