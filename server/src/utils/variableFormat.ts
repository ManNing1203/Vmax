// Converts object keys from snake_case to camelCase
export function snakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel); // iterate arrays recursively
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
    // Special handling for notification metadata to preserve its original structure
    if (key === 'metadata') {
      acc[camelKey] = obj[key]; // Don't convert metadata at all - preserve entire structure
    } else {
      acc[camelKey] = snakeToCamel(obj[key]);
    }
    return acc;
  }, {} as any);
}

// Converts object keys from camelCase to snake_case
export function camelToSnake(obj: any): any {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    // Special handling for notification metadata to preserve its original structure
    if (key === 'metadata') {
      acc[snakeKey] = obj[key]; // Don't convert metadata at all - preserve entire structure
    } else {
      acc[snakeKey] = camelToSnake(obj[key]);
    }
    return acc;
  }, {} as any);
}
