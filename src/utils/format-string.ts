export function removeSpacesAndLowerCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '');
}

export function removeSpaces(str: string): string {
  return str.replace(/\s+/g, '');
}
