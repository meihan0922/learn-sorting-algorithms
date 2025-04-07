export function bubbleSort_v1(array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let u = 0; u < array.length - 1 - i; u++) {
      // 左右相比
      if (array[u] > array[u + 1]) {
        // 交換
        [array[u], array[u + 1]] = [array[u + 1], array[u]];
      }
    }
  }
  return array;
}

// 再優化，每一次都必須做雙迴圈檢查嗎？
export function bubbleSort_v2(array: number[]) {
  let n = array.length;
  // 有交換嗎？如果一整輪都沒換過值，代表整個陣列已經有序了，就可以提前跳出迴圈。
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      // 左右相比
      if (array[i] > array[i + 1]) {
        // 交換
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
      }
    }
    n--;
  }
  return array;
}

export function* bubbleSortGenerator(array: number[]) {
  let n = array.length;
  // 有交換嗎？如果一整輪都沒換過值，代表整個陣列已經有序了，就可以提前跳出迴圈。
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      yield [
        [i], // 標記正在比較的位置
        Array.from(
          { length: array.length - n },
          (_, i) => array.length - i - 1 // 標記哪些 index 已經排好了
        ), // ex: [7, 8, 9] 已經排序完成
      ];
      // 左右相比
      if (array[i] > array[i + 1]) {
        // 交換
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
      }
      n--;
    }
  }

  // 回傳，補上全部完成！讓動畫可以進行變色
  yield [[], Array.from({ length: array.length }, (_, i) => i)];

  return array;
}
