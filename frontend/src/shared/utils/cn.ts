type ClassRecord = Record<string, unknown>;
type ClassValue = string | number | boolean | undefined | null | ClassRecord | ClassValue[];

// cn utility : supporte les strings, tableaux et objets { 'className': condition }
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input as ClassRecord)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

export default cn;
