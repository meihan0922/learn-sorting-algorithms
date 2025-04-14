import "./App.css";
import {
  bubbleSortGenerator,
  bubbleSort_v1_str,
  bubbleSort_v2_str,
} from "./algorithms/bubble";
import {
  insertionSortGenerator,
  insertionSort_v1_str,
  insertionSort_v2_str,
} from "./algorithms/insertion";
import {
  selectionSort_v1_str,
  selectionSortGenerator,
} from "./algorithms/selection";
import {
  quickSortGenerator,
  quickSort_v1,
  quickSort_v2,
  quickSort_v3,
} from "./algorithms/quick";

export const SORTING_ALGORITHMS = {
  bubble: {
    title: "🫧 bubble 氣泡排序法",
    point: "兩兩相比，大的往後換，換到最後最大的就會先排好了",
    note: "每次比對相鄰的兩個數字，把比較大的慢慢「浮」到右邊（也就是陣列的尾端），一輪一輪重複這個動作。也就是說，每一輪最大的項目都會被排好，總共會進行 n(n - 1) / 2 次，（下一輪次數會逐一遞減）。",
    optimization:
      "設一個 flag 紀錄在第一輪結束後，發現都沒有交換時，表示已經是有序的，就不用再處理了！",
    form: [
      "時間複雜度：最壞與平均都是 O(n²)",
      "穩定性：穩定排序（相同數字順序不會改變）",
      "額外空間： O(1)（原地排序）",
      "👎 缺點：效率低，不適合大資料量",
    ],
    func: [bubbleSort_v1_str, bubbleSort_v2_str],
    algorithmsGenerator: bubbleSortGenerator,
  },
  insertion: {
    title: "🃏 insertion 插入排序法",
    point:
      "一邊掃描，一邊插入到對的位置！ / 你有比前面小嗎？有的話往前站，直到比前面大為止",
    note: "將陣列分成「已排序」與「未排序」兩部分，每次從未排序區中選出一個元素，插入到已排序區的正確位置。想像在排撲克牌，每抽一張牌，就從右往左插入到對的位置，直到牌變得整整齊齊。所以只要一插入到對的就可以再進入下一輪比較。",
    optimization:
      "不一邊找一邊交換！先找出索引位置，再插入。動畫為了明顯交換的動作，沒有做到這點。",
    form: [
      "時間複雜度：最壞 O(n²)、最好 O(n) 、平均是 O(n²)",
      "穩定性：穩定排序（相同數字順序不會改變）",
      "額外空間： O(1)（原地排序）",
      "👎 缺點：效率低，不適合大資料量",
    ],
    func: [insertionSort_v1_str, insertionSort_v2_str],
    algorithmsGenerator: insertionSortGenerator,
  },
  selection: {
    title: "🔄 selection 選擇排序",
    point: "掃描選出最小的往前換到對的位置，重複",
    note: "每一輪從還沒排序的區段中，找出最小值，然後把它交換到正確位置。",
    optimization: "❌",
    form: [
      "時間複雜度：固定為 O(n²)，比較次數固定 n(n-1)/2 次（無論排序狀況）",
      "穩定性：不穩定（意思是如果有重複元素，排序後相對順序不一定保留）",
      "額外空間： O(1)（原地排序）",
      "👎 缺點：效率低，不適合大資料量",
    ],
    func: [selectionSort_v1_str],
    algorithmsGenerator: selectionSortGenerator,
  },
  quick: {
    title: "🚀 quick 快速排序法",
    point: "切割分組掃描，重複 N 次",
    note: `快速排序法是一種 分治法（Divide and Conquer） 的應用。平均效能非常好，實務上最常使用的排序法之一。它的基本邏輯是：1️⃣ 選一個基準值（pivot）。 2️⃣ 將小於 pivot 的放左邊，大於 pivot 的放右邊。 3️⃣ 對左、右兩側的子陣列 遞迴地做一樣的事。(遞迴太深時可能造成 stack overflow)。如果 pivot 選不好或是已經趨近於排序完成的遞迴，則效率會急劇下降。`,
    optimization:
      "1️⃣ 原地劃分（in-place），使用交換位置來劃分兩個區間，比較之後左邊為較小的，右邊為較大的  2️⃣ 基準值如果趨於中間是效率最佳的，因此選三個數中的中間值，當中位數，效果會更好。 3️⃣ 尾遞迴優化（Tail Recursion），優先處理較小的區間，避免 callStack 爆炸，節省記憶體",
    form: [
      "時間複雜度：平均和最好是 O(n log n)，最差是 O(n²)。舉例：n=8，每次都切一半的話，要切 3 次，因此是需要 log n 層的遞迴，每次切割後都要掃描一次陣列分組(partition 分割)，所以是 O(n)。O(每層做的事情) × O(總共有幾層) = O(n) × O(log n) = O(n log n)",
      "空間複雜度：O(log n)（只用到遞迴堆疊空間）",
      "額外空間： 因為使用遞迴，最好是 O(log n)，最差是 O(n)",
      "如果陣列的長度<=10，則用其他的排序法會較快",
    ],
    func: [quickSort_v1, quickSort_v2, quickSort_v3],
    algorithmsGenerator: quickSortGenerator,
  },
  merge: {
    title: "merge 合併排序法",
    point: "",
    note: "",
    optimization: "❌",
    form: [],
    func: [],
    algorithmsGenerator: bubbleSortGenerator,
  },
};
