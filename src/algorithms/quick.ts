export const quickSort_v1 = `// 版本一
function quickSort_v1(array: number[]) {
  // 持續遞迴，表示已經切割到極限了
  if (array.length <= 1) return array;

  // 設定基準值為最後一個
  const pivot = array[array.length - 1];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivot) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return [...quickSort_v1(left), pivot, ...quickSort_v1(right)];
}`;

export const quickSort_v2 = `// 版本二，加上原地劃分（in-place）
function partition(arr: number[], start: number, end: number) {
  const pivot = arr[end];
  let i = start;

  for (let j = start; j < end; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[end]] = [arr[end], arr[i]];
  return i;
}

function quickSort_v2(
  array: number[],
  start: number = 0,
  end: number = array.length - 1
) {
  // 如果一直都是最末的索引值大於最小的索引值，表尚未比較完全
  if (start >= end) {
    return array;
  }
  const pivotIndex = partition(array, start, end);
  quickSort_v2(array, start, pivotIndex - 1); // 處理左邊
  quickSort_v2(array, pivotIndex + 1, end); // 處理右邊
  return array;
}`;

export const quickSort_v3 = `// 版本三，加上基準值取中，和優先處理較小的區間，避免 callStack 爆炸
function medianOfThree(arr: number[], low: number, high: number) {
  const mid = Math.floor((low + high) / 2); // 最中間的索引值
  const a = arr[low],
    b = arr[mid],
    c = arr[high];
  // 取中間值
  if ((a - b) * (c - a) >= 0) return low; // a 是中位數 (b <= a && a <= c) || (c <= a && a <= b)
  if ((b - a) * (c - b) >= 0) return mid; // b 是中位數 ((a <= b && b <= c) || (c <= b && b <= a))
  return high; // 都不是就是 c
}

function partition(arr: number[], low: number, high: number): number {
  // 如果大的索引值和小的索引值已經是一樣或是在旁邊了，
  // 就直接進行比較，看要不要交換就好，不用再接下去處理了
  if (high - low <= 1) {
    if (arr[high] >= arr[low]) {
      return low;
    }
    if (arr[high] < arr[low]) {
      [arr[low], arr[high]] = [arr[high], arr[low]];
      return high;
    }
  }

  const pivotIndex = medianOfThree(arr, low, high);
  const pivotValue = arr[pivotIndex] as number;
  // 將 pivot 移到最後面
  [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];

  let i = low;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivotValue) {
      // 如果 值小於基準值，則將比基準值大的區間的最前面的值和此替換
      // 比方 p = 6; 
      // [2, 3, 1, | "8", 7, "5"] ， 8 為較大的區間的第一個值、5 為目前的比較值
      // [2, 3, 1, 5, 7, 8] ， 5 和 8 交換
      [arr[i], arr[j]] = [arr[j], arr[i]];
      // 並且紀錄較大區間的 第一個索引值為 i++;
      i++;
    }
  }
  // 最後，把 p 所應該在的位置就是 i，（左邊都為比 p 小，右邊都為比 p 大的區間）
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}

export function quickSort(array: number[]) {
  const stack: { start: number; end: number }[] = [
    { start: 0, end: array.length - 1 },
  ];

  while (stack.length > 0) {
    let { start, end } = stack.pop()!;

    while (start < end) {
      // 目前的 p 值，且被排序到對的位置了，
      const pivotIndex = partition(array, start, end);

      // 尾遞迴優化：先處理小區間
      if (pivotIndex - start < end - pivotIndex) {
        // 把較大的區間，推入待處理區
        stack.push({ start: pivotIndex + 1, end });
        // 優先處理較小的區間
        end = pivotIndex - 1;
      } else {
        stack.push({ start, end: pivotIndex - 1 });
        start = pivotIndex + 1;
      }
    }
  }

  return array;
}`;

function medianOfThree(arr: number[], low: number, high: number) {
  // 取中間值
  const mid = Math.floor((low + high) / 2); // 最中間的索引值
  const a = arr[low],
    b = arr[mid],
    c = arr[high];
  // 取中間值
  if ((a - b) * (c - a) >= 0) return low; // a 是中位數 (b <= a && a <= c) || (c <= a && a <= b)
  if ((b - a) * (c - b) >= 0) return mid; // b 是中位數 ((a <= b && b <= c) || (c <= b && b <= a))
  return high; // 都不是就是 c
}

function* partition(
  arr: number[],
  low: number,
  high: number,
  sorted: number[]
): Generator<[number[], number[]], number, unknown> {
  // 如果大的索引值和小的索引值已經是一樣或是在旁邊了，
  // 就直接進行比較，看要不要交換就好，不用再接下去處理了
  if (high - low <= 1) {
    sorted.push(low, high);
    if (arr[high] >= arr[low]) {
      yield [[], [...sorted]];
      return low;
    }
    if (arr[high] < arr[low]) {
      [arr[low], arr[high]] = [arr[high], arr[low]];
      yield [[], [...sorted]];
      return high;
    }
  }

  const mid = Math.floor((low + high) / 2); // 最中間的索引值
  yield [[low, mid, high], [...sorted]];
  const pivotIndex = medianOfThree(arr, low, high);
  const pivotValue = arr[pivotIndex];
  // 將 pivot 移到最後面
  if (pivotIndex !== high) {
    yield [[high, pivotIndex], [...sorted]];
    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    yield [[pivotIndex, high], [...sorted]];
  }
  let i = low;

  for (let j = low; j < high; j++) {
    yield [[j, high, i], [...sorted]];
    if (arr[j] < pivotValue) {
      // 如果 值小於基準值，則將比基準值大的區間的最前面的值和此替換
      // 比方 p = 6;
      // [2, 3, 1, | "8", 7, "5"] ， 8 為較大的區間的第一個值、5 為目前的比較值
      // [2, 3, 1, 5, 7, 8] ， 5 和 8 交換
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield [[i, high, j], [...sorted]];
      // 並且紀錄較大區間的 第一個索引值為 i++;
      i++;
      yield [[i, high, j], [...sorted]];
    }
  }

  yield [[high, i], [...sorted]];
  [arr[i], arr[high]] = [arr[high], arr[i]];
  sorted.push(i);
  yield [[i, high], [...sorted]];
  return i; // 已經排好的中間值
}

export function* quickSortGenerator(array: number[]) {
  const stack: { start: number; end: number }[] = [
    { start: 0, end: array.length - 1 },
  ];
  const sortedIndices: number[] = [];

  while (stack.length > 0) {
    let { start, end } = stack.pop()!;

    while (start < end) {
      const pivotIndex = yield* partition(array, start, end, sortedIndices);

      // 以較小的區間優先處理
      if (pivotIndex - start < end - pivotIndex) {
        // 把較大的區間，推入待處理區
        stack.push({ start: pivotIndex + 1, end });
        // 優先處理較小的區間
        end = pivotIndex - 1;
      } else {
        stack.push({ start, end: pivotIndex - 1 });
        start = pivotIndex + 1;
      }
    }

    if (start === end) {
      sortedIndices.push(start);
    }
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ];
  return array;
}
