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
import { FormEvent, useEffect, useReducer } from "react";
import { cn } from "./utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SORTING_ALGORITHMS } from "./data";

const MAX_ARRAY_LENGTH = 200;
const MIN_ARRAY_LENGTH = 10;
const MAX_SPEED = 10;
const MIN_SPEED = 0.5;
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
type SortingAlgorithm = keyof typeof SORTING_ALGORITHMS;
type State = {
  sortingAlgorithm: SortingAlgorithm;
  sortingSpeed: number;
  randomArray: number[];
  // ! 正在被比較的兩個位置
  activeIndices: number[];
  // ! 已經處理完成的位置、不再需要處理的資料索引
  sortedIndices: number[];
  activeSortingFunction?: Generator<[number[], number[]]>;
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
        activeIndices: [],
        sortedIndices: [],
        activeSortingFunction: undefined,
        randomArray: getRandomElements(state.randomArray.length),
      };
    // 排序
    case "SORT":
      return {
        ...state,
        activeSortingFunction:
          state.activeSortingFunction ??
          SORTING_ALGORITHMS[state.sortingAlgorithm].algorithmsGenerator(
            state.randomArray
          ),
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
        activeSortingFunction: undefined,
      };
    // 更換排序法
    case "CHANGE_ALGORITHM":
      if (state.isSorting) return state;
      return {
        ...state,
        activeIndices: [],
        sortedIndices: [],
        activeSortingFunction: undefined,
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
        activeIndices: [],
        sortedIndices: [],
        activeSortingFunction: undefined,
        randomArray: getRandomElements(action.payload),
      };
    case "SET_INDICES":
      return {
        ...state,
        activeIndices: action.payload.active,
        sortedIndices: action.payload.sorted,
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
      activeSortingFunction,
    },
    dispatch,
  ] = useReducer(reducer, {
    sortingAlgorithm: "bubble",
    sortingSpeed: 1,
    randomArray: getRandomElements(10),
    isSorting: false,
    activeIndices: [],
    sortedIndices: [],
    activeSortingFunction: undefined,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isSorting) {
      dispatch({ type: "STOP" });
    } else {
      dispatch({ type: "SORT" });
    }
  }

  // 只要變換排序法或暫停或改變速度，就不再繼續執行
  useEffect(() => {
    /**
     * ? 為什麼需要設定 isCancel 這個 flag?
     * 1. effect 的 dependencies 改變時，跑上一次的清除函式，才執行新的 effect
     * 2. 元件 unmount 時
     * 但是， inner() 是一個 async 函式，他會在背景繼續執行，即使上一個 effect 已經清掉了，非同步函式仍然不會暫停！
     * ! react 只會取消該 effect 的生命週期，非同步的事件循環是無法阻止的
     * 如果！非同步的函式中，又去執行 dispatch 那麼有可能會試圖去更新被卸載的元件，
     * ! 也就會發生記憶體洩漏，isCancel 會自行中斷後續的操作，
     * ! 只要在 useEffect 裡用到 async function、setTimeout、fetch、動畫、WebSocket 等延遲/持續型操作，都強烈建議這樣做保險
     */
    let isCancel = false;
    let timer: ReturnType<typeof setTimeout>;
    async function inner() {
      while (activeSortingFunction && isSorting && !isCancel) {
        const {
          done,
          value: [active, sorted],
        } = activeSortingFunction.next();
        if (done) {
          dispatch({ type: "FINISH_SORTING" });
          return;
        }
        dispatch({ type: "SET_INDICES", payload: { active, sorted } });
        // 簡單的非同步「計時器」，用來控制排序動畫的速度
        await new Promise((resolve) => {
          // * 1000 / OPERATIONS_PER_SECOND 一秒執行幾次
          // * sortingSpeed 再加速
          timer = setTimeout(
            resolve,
            1000 / OPERATIONS_PER_SECOND / sortingSpeed
          );
        });
      }
    }

    inner();

    return () => {
      clearTimeout(timer);
      isCancel = true;
    };
  }, [activeSortingFunction, isSorting, sortingSpeed]);

  return (
    <>
      <div className="h-full flex flex-col gap-1 min-w-32 md:gap-2">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 items-end grid-cols-2 md:grid-cols-4 md:gap-8"
        >
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
                {Object.entries(SORTING_ALGORITHMS).map(
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
                  activeIndices[0] === index && "bg-accent",
                  activeIndices[1] === index && "bg-accent opacity-70",
                  activeIndices.length > 2 &&
                    activeIndices[2] === index &&
                    "bg-accent"
                )}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="flex-2/5 h-full p-8 pr-0 border-l-2 ml-8 text-left overflow-scroll">
            <h2 className="text-2xl mb-4 font-bold">
              {SORTING_ALGORITHMS[sortingAlgorithm].title}
            </h2>
            <p className="font-medium mb-1.5">
              {SORTING_ALGORITHMS[sortingAlgorithm].point}
            </p>
            <span className="text-sm">
              {SORTING_ALGORITHMS[sortingAlgorithm].note}
            </span>
            <p className="mt-8 text-sm">
              🌟 優化： {SORTING_ALGORITHMS[sortingAlgorithm].optimization}
            </p>
            <ul className="mt-8 text-sm">
              {SORTING_ALGORITHMS[sortingAlgorithm].form.map((i) => {
                return <li key={i}>- {i}</li>;
              })}
            </ul>
            <ul className="mt-8 text-sm">
              {SORTING_ALGORITHMS[sortingAlgorithm].func.map((i, idx) => {
                return <FunctionViewer func={i} key={idx} />;
              })}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

const FunctionViewer = ({ func }: { func: string }) => {
  return (
    <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
      {func}
    </SyntaxHighlighter>
  );
};

export default App;
