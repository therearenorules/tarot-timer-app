// Define ClassValue type locally instead of importing from clsx
type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | ClassArray 
  | ClassDictionary;

interface ClassDictionary {
  [id: string]: any;
}

interface ClassArray extends Array<ClassValue> {}

// Simple clsx implementation
function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const result = clsx(...input);
      if (result) classes.push(result);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  
  return classes.join(' ');
}

// Simple twMerge implementation
function twMerge(...classLists: string[]): string {
  const merged = classLists.filter(Boolean).join(' ');
  
  // Basic deduplication - just return the merged string
  // In a real implementation, this would handle Tailwind class conflicts
  return merged;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}