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

const SORTING_ALGORITHMS = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
] as const;

const MAX_ARRAY_LENGTH = 300;
const MIN_ARRAY_LENGTH = 10;
const MAX_SPEED = 50;
const MIN_SPEED = 1;

function App() {
  return (
    <>
      <div className="flex flex-col gap-1 min-w-32 md:gap-2">
        <form className="grid gap-4 items-end grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-1 md:gap-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <SelectRoot
            // disabled={isSorting}
            // value={sortingAlgorithm}
            // onValueChange={(e) =>
            //   dispatch({
            //     type: "CHANGE_ALGORITHM",
            //     payload: e as SortingAlgorithm,
            //   })
            // }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sorting Algorithm" />
              </SelectTrigger>
              <SelectPortalContent>
                {SORTING_ALGORITHMS.map((algorithm) => (
                  <SelectItem key={algorithm} value={algorithm}>
                    {algorithm}
                  </SelectItem>
                ))}
              </SelectPortalContent>
            </SelectRoot>
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="amountOfItems">Amount</Label>
            <Input
              id="amountOfItems"
              type="number"
              // disabled={isSorting}
              // defaultValue={randomArray.length}
              onChange={(e) => {}}
              max={MAX_ARRAY_LENGTH}
              min={MIN_ARRAY_LENGTH}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="speed">
              Speed <small>(10x)</small>
            </Label>
            <div className="h-9 flex items-center">
              <Slider
                id="speed"
                value={[10]}
                onValueChange={(e) => {}}
                max={MAX_SPEED}
                min={MIN_SPEED}
                step={1}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {/* <Button variant={isSorting ? "accent" : "default"}> 
        {isSorting ? "Stop" : "Sort"} 
         </Button> */}
            <Button variant={"default"}>Stop</Button>
            <Button
              // onClick={() => dispatch({ type: "RANDOMIZE" })}
              // disabled={isSorting}
              type="button"
              variant="outline"
            >
              Randomize
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
