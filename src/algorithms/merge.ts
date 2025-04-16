export const mergeSort_v1 = `function mergeSort_v1(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  // 持續分割
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort_v1(arr.slice(0, mid));
  const right = mergeSort_v1(arr.slice(mid));
  // 分割完合併
  const result: number[] = [];

  let lIndex = 0,
    rIndex = 0;

  while (lIndex < left.length && rIndex < right.length) {
    // 位置比較，如果 左邊的值較小，則推入，並且 lIndex++，比較下一個位置值
    if (left[lIndex] < right[rIndex]) {
      result.push(left[lIndex++]);
    } else {
      result.push(right[rIndex++]);
    }
  }

  return result.concat(left.slice(lIndex), right.slice(rIndex));
}`;

export const mergeSort_v2 = `function mergeSort_v2(
  arr: number[],
  start = 0,
  end = arr.length - 1
): number[] {
  // 原地 in-place 排序
  if (start >= end) return arr;

  // 持續分割＆合併
  const mid = Math.floor((start + end) / 2);
  mergeSort_v2(arr, start, mid);
  mergeSort_v2(arr, mid + 1, end);

  // 複製左邊和右邊
  const left = arr.slice(start, mid + 1); // [start, ....mid]
  const right = arr.slice(mid + 1, end + 1); // [mid+1 ,...end]

  let i = 0; // 左邊子陣列的 index
  let j = 0; // 右邊子陣列的 index
  let k = start; // 寫入 arr 的位置

  // ex: [2,8] [4,6] 合併
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }

  // 把剩下的左邊或右邊補上
  while (i < left.length) {
    arr[k++] = left[i++];
  }
  while (j < right.length) {
    arr[k++] = right[j++];
  }
  return arr;
}`;

function* merge(
  arr: number[],
  start: number,
  mid: number,
  end: number
): Generator<[number[], number[]]> {
  let i = start;
  let j = mid + 1;
  let startOffset = 0;

  // 顯示左邊區間
  yield [[], [...Array.from({ length: j - i }, (_, idx) => idx + i)]];
  yield [[], []];
  // 顯示右邊區間
  yield [[], [...Array.from({ length: end - mid }, (_, idx) => idx + mid + 1)]];
  yield [[], []];

  while (i <= mid + startOffset && j <= end) {
    // 顯示左右區間，當前比較的索引值
    yield [[i, j], []];

    if (arr[i] <= arr[j]) {
      // 左區間較小，拿左區間下一個值跟右區間比較
      i++;
      yield [[i, j], []];
    } else {
      // 左區間大於右區間
      const value = arr[j];
      // 拔出，和插入到左邊當前位置
      arr.splice(j, 1);
      arr.splice(i, 0, value);
      // 顯示位置的交換，右邊值移動到了 i，原左邊的比較值移動到了 i+1
      yield [[i + 1, i], []];
      yield [[], []];
      // 拿右區間下一個值跟左區間比較
      j++;
      // * startOffset：移動次數
      // 在下一輪當中， arr 因經歷過元素被抽出＆插入，arr[i] 可能會是右邊移動到左邊的值，
      // 並且變成“右邊移動到左邊的值”和“右邊”的值在比較，此時會經過判斷式 i++，
      // 被往後擠的剩餘的左邊值，如果還是使用 i < mid(原左邊區間的結束位置)，
      // 就會提早結束，i 必須要＋上移動次數！
      startOffset++;
    }
  }
}

export function* mergeSortGenerator(
  arr: number[],
  start = 0,
  end = arr.length - 1
): Generator<[number[], number[]]> {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);

  // 持續分割直到無法分割為止，進入合併 merge()
  yield* mergeSortGenerator(arr, start, mid);
  yield* mergeSortGenerator(arr, mid + 1, end);
  yield* merge(arr, start, mid, end);

  if (start === 0 && end === arr.length - 1) {
    // 顯示目前已排序完成
    yield [[], [...Array.from({ length: arr.length }, (_, idx) => idx)]];
  }

  return arr;
}
