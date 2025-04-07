import "./App.css";
import {
  SelectRoot,
  SelectItem,
  SelectPortalContent,
  SelectTrigger,
  SelectValue,
} from "./components/select";
import { Label } from "./components/label";
import { Input } from "./components/input";
import { Button } from "./components/button";
import { Slider } from "./components/slider";
import { useReducer } from "react";
import { cn } from "./utils";
import {
  bubbleSortGenerator,
  bubbleSort_v1,
  bubbleSort_v2,
} from "./algorithms/bubble";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const SORTING_ALGORITHMS_NOTE = {
  bubble: {
    title: "🫧 bubble 氣泡排序法",
    point: "兩兩相比，大的往後換",
    note: "每次比對相鄰的兩個數字，把比較大的慢慢「浮」到右邊（也就是陣列的尾端），一輪一輪重複這個動作。也就是說，每一輪最大的項目都會被排好，也就是說會進行 n(n - 1) / 2 次，（下一輪次數會逐一遞減）。可以優化的方式是，設一個 flag 紀錄在第一輪結束後，發現都沒有交換時，表示已經是有序的，就不用再處理了",
    form: [
      "時間複雜度：最壞與平均都是 O(n²)",
      "穩定性：穩定排序（相同數字順序不會改變）",
      "額外空間：O(1)（原地排序）",
      "👍 優點：實作簡單，教學友善",
      "👎 缺點：效率低，不適合大資料量",
    ],
    func: [bubbleSort_v1, bubbleSort_v2],
  },
  insertion: {
    title: "insertion 插入排序法",
    point: "",
    note: "",
    form: [],
    func: [],
  },
  selection: {
    title: "selection 選擇排序",
    point: "",
    note: "",
    form: [],
    func: [],
  },
  quick: {
    title: "quick 快速排序法",
    point: "",
    note: "",
    form: [],
    func: [],
  },
  merge: {
    title: "merge 合併排序法",
    point: "",
    note: "",
    form: [],
    func: [],
  },
};

const MAX_ARRAY_LENGTH = 200;
const MIN_ARRAY_LENGTH = 10;
const MAX_SPEED = 50;
const MIN_SPEED = 1;
const OPERATIONS_PER_SECOND = 2;

type Action =
  | { type: "RANDOMIZE" }
  | { type: "SORT" }
  | { type: "STOP" }
  | { type: "FINISH_SORTING" }
  | { type: "CHANGE_ALGORITHM"; payload: SortingAlgorithm }
  | { type: "CHANGE_SPEED"; payload: number }
  | { type: "CHANGE_ARRAY_LENGTH"; payload: number }
  | { type: "SET_INDICES"; payload: { active: number[]; sorted: number[] } };
type SortingAlgorithm = keyof typeof SORTING_ALGORITHMS_NOTE;
type State = {
  sortingAlgorithm: SortingAlgorithm;
  sortingSpeed: number;
  randomArray: number[];
  // ! 正在被比較的兩個位置
  activeIndices: number[];
  // ! 已經處理完成的位置、不再需要處理的資料索引
  sortedIndices: number[];
  // activeSortingFunction?: Generator<[number[], number[]]>
  isSorting: boolean;
};

function getRandomElements(arraySize: number) {
  return Array.from(
    { length: arraySize },
    () => Math.floor(Math.random() * 100) + 1
  );
}
function reducer(state: State, action: Action): State {
  switch (action.type) {
    // 隨機陣列
    case "RANDOMIZE":
      if (state.isSorting) return state;
      return {
        ...state,
        isSorting: false,
        randomArray: getRandomElements(state.randomArray.length),
      };
    // 排序
    case "SORT":
      return {
        ...state,
        isSorting: true,
      };
    // 暫停
    case "STOP":
      return {
        ...state,
        isSorting: false,
      };
    // 完成排序
    case "FINISH_SORTING":
      return {
        ...state,
        isSorting: false,
      };
    // 更換排序法
    case "CHANGE_ALGORITHM":
      if (state.isSorting) return state;
      return {
        ...state,
        sortingAlgorithm: action.payload,
      };
    // 更換速度
    case "CHANGE_SPEED":
      if (action.payload > MAX_SPEED || action.payload < MIN_SPEED)
        return state;
      return {
        ...state,
        sortingSpeed: action.payload,
      };
    // 更換陣列長度
    case "CHANGE_ARRAY_LENGTH":
      if (
        action.payload < MIN_ARRAY_LENGTH ||
        action.payload > MAX_ARRAY_LENGTH ||
        isNaN(action.payload)
      ) {
        return state;
      }
      if (state.isSorting) return state;
      return {
        ...state,
        isSorting: false,
        randomArray: getRandomElements(action.payload),
      };
    default:
      throw new Error(`Invalid action: ${action}`);
  }
}

function App() {
  const [
    {
      sortedIndices,
      activeIndices,
      sortingAlgorithm,
      sortingSpeed,
      randomArray,
      isSorting,
    },
    dispatch,
  ] = useReducer(reducer, {
    sortingAlgorithm: "bubble",
    sortingSpeed: 1,
    randomArray: getRandomElements(10),
    isSorting: false,
    activeIndices: [],
    sortedIndices: [],
  });

  return (
    <>
      <div className="h-full flex flex-col gap-1 min-w-32 md:gap-2">
        <form className="grid gap-4 items-end grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-1 md:gap-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <SelectRoot
              disabled={isSorting}
              value={sortingAlgorithm}
              onValueChange={(e) =>
                dispatch({
                  type: "CHANGE_ALGORITHM",
                  payload: e as SortingAlgorithm,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sorting Algorithm" />
              </SelectTrigger>
              <SelectPortalContent>
                {Object.entries(SORTING_ALGORITHMS_NOTE).map(
                  ([algorithm, { title }]) => (
                    <SelectItem key={algorithm} value={algorithm}>
                      {title}
                    </SelectItem>
                  )
                )}
              </SelectPortalContent>
            </SelectRoot>
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="amountOfItems">Amount</Label>
            <Input
              id="amountOfItems"
              type="number"
              disabled={isSorting}
              defaultValue={randomArray.length}
              onChange={(e) => {
                dispatch({
                  type: "CHANGE_ARRAY_LENGTH",
                  payload: e.target.valueAsNumber,
                });
              }}
              max={MAX_ARRAY_LENGTH}
              min={MIN_ARRAY_LENGTH}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="speed">
              Speed <small>({sortingSpeed}x)</small>
            </Label>
            <div className="h-9 flex items-center">
              <Slider
                id="speed"
                value={[sortingSpeed]}
                onValueChange={(e) =>
                  dispatch({ type: "CHANGE_SPEED", payload: e[0] })
                }
                max={MAX_SPEED}
                min={MIN_SPEED}
                step={1}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={isSorting ? "accent" : "default"}>
              {isSorting ? "Stop" : "Sort"}
            </Button>
            <Button
              onClick={() => dispatch({ type: "RANDOMIZE" })}
              disabled={isSorting}
              type="button"
              variant="outline"
            >
              Randomize
            </Button>
          </div>
        </form>
        <main className="flex overflow-hidden h-full p-4">
          <div className="flex items-end w-full grow h-full">
            {randomArray.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "grow flex items-end justify-center pb-2 bg-muted",
                  sortedIndices.includes(index) && "bg-secondary",
                  activeIndices.includes(index) && "bg-accent"
                )}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="flex-2/5 h-full p-8 pr-0 border-l-2 ml-8 text-left overflow-scroll">
            <h2 className="text-2xl mb-4 font-bold">
              {SORTING_ALGORITHMS_NOTE[sortingAlgorithm].title}
            </h2>
            <p className="font-medium mb-1.5">
              {SORTING_ALGORITHMS_NOTE[sortingAlgorithm].point}
            </p>
            <span className="text-sm">
              {SORTING_ALGORITHMS_NOTE[sortingAlgorithm].note}
            </span>
            <ul className="mt-10 text-sm">
              {SORTING_ALGORITHMS_NOTE[sortingAlgorithm].form.map((i) => {
                return <li key={i}>- {i}</li>;
              })}
            </ul>
            <ul className="mt-10 text-sm">
              {SORTING_ALGORITHMS_NOTE[sortingAlgorithm].func.map((i, idx) => {
                return <FunctionViewer func={i} key={idx} />;
              })}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

const FunctionViewer = ({ func }: { func: (array: number[]) => number[] }) => {
  return (
    <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
      {func.toString()}
    </SyntaxHighlighter>
  );
};

function getSortingFunction(algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case "bubble":
      return bubbleSortGenerator;
    case "insertion":
      return bubbleSortGenerator;
    case "selection":
      return bubbleSortGenerator;
    case "quick":
      return bubbleSortGenerator;
    case "merge":
      return bubbleSortGenerator;
    default:
      throw new Error(`Invalid algorithm: ${algorithm satisfies never}`);
  }
}

export default App;
