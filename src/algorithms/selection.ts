export const selectionSort_v1_str = `function selectionSort_v1(array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let u = i + 1; u < array.length; u++) {
      // 紀錄剩餘最小的索引值
      if (array[u] < array[minIndex]) {
        minIndex = u;
      }
    }
    // 有找到最小的，交換
    if (minIndex !== i) {
      [array[minIndex], array[i]] = [array[i], array[minIndex]];
    }
  }
  return array;
}`;

export function* selectionSortGenerator(array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let u = i + 1; u < array.length; u++) {
      yield [[i, u, minIndex], Array.from({ length: i }, (_, i) => i)] as [
        number[],
        number[]
      ];
      // 紀錄剩餘最小的索引值
      if (array[u] < array[minIndex]) {
        minIndex = u;
      }
    }
    // 有找到最小的，交換
    if (minIndex !== i) {
      yield [[i, minIndex], Array.from({ length: i }, (_, i) => i)] as [
        number[],
        number[]
      ];
      [array[minIndex], array[i]] = [array[i], array[minIndex]];
    }
  }
  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ];
  return array;
}
