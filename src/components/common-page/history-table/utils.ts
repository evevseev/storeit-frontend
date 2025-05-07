function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

type Diff = {
  key: string;
  path: string[];
  oldValue: any;
  newValue: any;
};

export function computeDiff(
  prechange: Record<string, any>,
  postchange: Record<string, any>,
  parentPath: string[] = []
): Diff[] {
  const diffs: Diff[] = [];

  const allKeys = new Set([...Object.keys(prechange), ...Object.keys(postchange)]);

  for (const key of allKeys) {
    const oldValue = prechange[key];
    const newValue = postchange[key];
    const currentPath = [...parentPath, key];

    if (isObject(oldValue) && isObject(newValue)) {
      diffs.push(...computeDiff(oldValue, newValue, currentPath));
    }
    else if (oldValue !== newValue) {
      diffs.push({
        key,
        path: currentPath,
        oldValue,
        newValue
      });
    }
  }

  return diffs;
} 
