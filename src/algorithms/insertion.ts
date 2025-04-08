const insertionSort_v1_str = `function insertionSort_v1(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    // 如果左邊大於右邊就交換
    for (let j = i; j > 0 && array[j] < array[j - 1]; j--) {
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
    }
  }
  return array;
}`;

const insertionSort_v2_str = `function insertionSort_v2(array: number[]) {
  // 原本是：『一邊比較一邊交換』，優化後：先找出要插入的位置，把元素搬一格，最後一次插入
  for (let i = 0; i < array.length; i++) {
    const current = array[i]; // 當前比較值
    let j = i - 1; // 從當前比較值的左邊開始做比對，一路比對到第0個
    // 如果有需要位移插入，則記下索引值 j，
    while (j >= 0 && array[j] > current) {
      // 把值向右邊移動
      array[j + 1] = array[j];
      j--;
    }
    // 最後，把要插入的值，放入 j 這個位置
    array[j + 1] = current;
  }
  return array;
}`;

export { insertionSort_v1_str, insertionSort_v2_str };

export function* insertionSortGenerator(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    const current = array[i]; // 當前比較值
    let j = i - 1; // 從當前比較值的左邊開始做比對，一路比對到第0個
    while (j >= 0 && array[j] > current) {
      yield [[j + 1, j], []] as [number[], number[]];
      // 放沒有優化過後的，視覺化比較好看到變化
      // array[j + 1] = array[j];
      [array[j], array[j + 1]] = [array[j + 1], array[j]];
      yield [[j, j + 1], []] as [number[], number[]];
      j--;
    }
    yield [[j + 1, j], []] as [number[], number[]];
    array[j + 1] = current;
    yield [[j + 1, j], []] as [number[], number[]];
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ];
  return array;
}
