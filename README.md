[TOC]

# 視覺化五種常見的排序法

- 原課程教學: [5 Must Know Sorting Algorithms Explained and Visualized](https://youtu.be/W35KhZq2xFQ?feature=shared)

- [線上視覺化排序筆記](https://learn-sorting-algorithms.vercel.app/)

## 🫧 bubble 氣泡排序法

### 兩兩相比，大的往後換，換到最後最大的就會先排好了

每次比對相鄰的兩個數字，把比較大的慢慢「浮」到右邊（也就是陣列的尾端），一輪一輪重複這個動作。也就是說，每一輪最大的項目都會被排好，總共會進行 n(n - 1) / 2 次，（下一輪次數會逐一遞減）。

🌟 優化：設一個 flag 紀錄在第一輪結束後，發現都沒有交換時，表示已經是有序的，就不用再處理了！

- 時間複雜度：最壞與平均都是 O(n²)
- 穩定性：穩定排序（相同數字順序不會改變）
- 額外空間： O(1)（原地排序）
- 👎 缺點：效率低，不適合大資料量

```tsx
function bubbleSort_v1(array: number[]) {
  for (let i = 0; i < array.length; i++) {
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

function bubbleSort_v2(array: number[]) {
  // 再優化，每一次都必須做雙迴圈檢查嗎？
  let n = array.length;
  // 有交換嗎？如果一整輪都沒換過值，代表整個陣列已經有序了，就可以提前跳出迴圈。
  let isSwipe = true;
  while (isSwipe) {
    isSwipe = false;
    for (let i = 0; i < n - 1; i++) {
      // 左右相比
      if (array[i] > array[i + 1]) {
        // 交換
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        isSwipe = true;
      }
    }
    n--;
  }
  return array;
}
```

## 🃏 insertion 插入排序法

### 一邊掃描，一邊插入到對的位置！ / 你有比前面小嗎？有的話往前站，直到比前面大為止

將陣列分成「已排序」與「未排序」兩部分，每次從未排序區中選出一個元素，插入到已排序區的正確位置。想像在排撲克牌，每抽一張牌，就從右往左插入到對的位置，直到牌變得整整齊齊。所以只要一插入到對的就可以再進入下一輪比較。

🌟 優化：不一邊找一邊交換！先找出索引位置，再插入。動畫為了明顯交換的動作，沒有做到這點。

- 時間複雜度：最壞 O(n²)、最好 O(n) 、平均是 O(n²)
- 穩定性：穩定排序（相同數字順序不會改變）
- 額外空間： O(1)（原地排序）
- 👎 缺點：效率低，不適合大資料量

```tsx
function insertionSort_v1(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    // 如果左邊大於右邊就交換
    for (let j = i; j > 0 && array[j] < array[j - 1]; j--) {
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
    }
  }
  return array;
}

function insertionSort_v2(array: number[]) {
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
}
```

## 🔄 selection 選擇排序

### 掃描選出最小的往前換到對的位置，重複

每一輪從還沒排序的區段中，找出最小值，然後把它交換到正確位置。

🌟 優化：❌

- 時間複雜度：固定為 O(n²)，比較次數固定 n(n-1)/2 次（無論排序狀況）
- 穩定性：不穩定（意思是如果有重複元素，排序後相對順序不一定保留）
- 額外空間： O(1)（原地排序）
- 👎 缺點：效率低，不適合大資料量

```tsx
function selectionSort_v1(array: number[]) {
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
}
```

## 🚀 quick 快速排序法

### 切割分組掃描，重複 N 次

快速排序法是一種 分治法（Divide and Conquer） 的應用。平均效能非常好，實務上最常使用的排序法之一。它的基本邏輯是：1️⃣ 選一個基準值（pivot）。 2️⃣ 將小於 pivot 的放左邊，大於 pivot 的放右邊。 3️⃣ 對左、右兩側的子陣列 遞迴地做一樣的事。(遞迴太深時可能造成 stack overflow)。如果 pivot 選不好或是已經趨近於排序完成的遞迴，則效率會急劇下降。

🌟 優化：
1️⃣ 原地劃分（in-place），使用交換位置來劃分兩個區間，比較之後左邊為較小的，右邊為較大的  
2️⃣ 基準值如果趨於中間是效率最佳的，因此選三個數中的中間值，當中位數，效果會更好。 3️⃣ 尾遞迴優化（Tail Recursion），優先處理較小的區間，避免 callStack 爆炸，節省記憶體

- 時間複雜度：平均和最好是 O(n log n)，最差是 O(n²)。舉例：n=8，每次都切一半的話，要切 3 次，因此是需要 log n 層的遞迴，每次切割後都要掃描一次陣列分組(partition 分割)，所以是 O(n)。O(每層做的事情) × O(總共有幾層) = O(n) × O(log n) = O(n log n)
- 空間複雜度：O(log n)（只用到遞迴堆疊空間），最差是 O(n)
- 如果陣列的長度<=10，則用其他的排序法會較快

```tsx
// 版本一
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
}

// 版本二，加上原地劃分（in-place）
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
}

// 版本三，加上基準值取中，和優先處理較小的區間，避免 callStack 爆炸
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
}
```

## 🔪 merge 合併排序法

### 🔪「一刀切一半、一刀切一半」切到底， 🍰「小份先排好，再慢慢組成大份」

合併排序主要包含兩個步驟: 1️⃣ 分割: 把陣列不斷對半分，直到每個子陣列都只剩一個元素為止。 2️⃣ 合併: 把這些小陣列「兩兩合併」，並且在合併過程中保持順序，最終組合成一個完整有序的陣列。 比方： [99, 16, 15, 26, 89]，[99, 16] | [15, 26, 89]，分割成單個再排列後 [16, 99] | [[15] | [26, 89]]，合併右邊，[16, 99] | [15, 26, 89]，接著 while 迴圈處理比較和插入即可

🌟 優化：
1️⃣ 原地劃分（in-place），不需額外複製整個陣列，空間更省，插入時保留順序，但需要大量搬移元素
2️⃣ 可以改寫成非遞迴，針對大型資料最穩定，動畫因為要直觀，寫成遞迴版本

- 時間複雜度：O(n log n)，分割 log n 次、每次合併花 n
- 時間複雜度：O(n)，需要額外陣列暫存合併結果
- 穩定排序: ✅ 是 相同元素不會交換位置
- ‼️ 大型資料量、需要穩定排序

```tsx
function mergeSort_v1(arr: number[]): number[] {
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
}

function mergeSort_v2(
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
}
```
