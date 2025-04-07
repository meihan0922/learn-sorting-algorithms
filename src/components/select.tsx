import * as Select from "@radix-ui/react-select";
import { cn } from "../utils.ts";

const SelectValue = ({
  ...props
}: React.ComponentProps<typeof Select.Value>) => {
  return <Select.Value data-slot="select-value" {...props} />;
};

const SelectTrigger = ({
  children,
  ...props
}: React.ComponentProps<typeof Select.Trigger>) => {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      className={
        "w-full border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2"
      }
      {...props}
    >
      {children}
      <Select.Icon>➕</Select.Icon>
    </Select.Trigger>
  );
};

const SelectPortalContent = ({ children }: React.PropsWithChildren) => {
  return (
    <Select.Portal>
      <Select.Content
        data-slot="select-content"
        className={
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
        }
        position="popper"
      >
        <Select.Viewport
          className={
            "p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          }
        >
          <Select.Group data-slot="select-group">{children}</Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
};

const SelectRoot = ({ ...props }: React.ComponentProps<typeof Select.Root>) => {
  return <Select.Root data-slot="select" {...props} />;
};

const SelectItem = ({
  children,
  ...props
}: React.ComponentProps<typeof Select.Item>) => {
  return (
    <Select.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
      )}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          ✔️
        </Select.ItemIndicator>
      </span>
    </Select.Item>
  );
};

export {
  SelectRoot,
  SelectItem,
  SelectPortalContent,
  SelectTrigger,
  SelectValue,
};
