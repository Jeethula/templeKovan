// components/ui/floating-input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, error, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          id={id}
          className={cn(
            "peer h-10 w-full border border-[#663399]/20 rounded-lg bg-transparent px-3 py-2 text-sm placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-[#663399]/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={id}
          className="absolute left-2 -top-2 z-10 px-2 text-xs text-gray-500 transition-all 
            peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 
            peer-focus:text-xs peer-focus:text-[#663399] bg-white"
        >
          {label}
        </Label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

// components/ui/floating-select.tsx
import { SelectProps } from "@radix-ui/react-select";
import { Select, SelectTrigger, SelectValue } from "./select";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown, Command } from "lucide-react";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

interface FloatingSelectProps extends Omit<SelectProps, "onValueChange"> {
  label: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const FloatingSelect = React.forwardRef<HTMLButtonElement, FloatingSelectProps>(
  ({ label, id, children, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Select {...props}>
          <SelectTrigger
            ref={ref}
            className={cn(
              "w-full border border-[#663399]/20 rounded-lg h-10 text-sm",
              className
            )}
          >
            <SelectValue placeholder=" " />
          </SelectTrigger>
          {children}
        </Select>
        <Label
          htmlFor={id}
          className="absolute left-2 -top-2 z-10 px-2 text-xs text-gray-500 
            transition-all bg-white"
        >
          {label}
        </Label>
      </div>
    );
  }
);
FloatingSelect.displayName = "FloatingSelect";

// components/ui/floating-search-combobox.tsx
interface FloatingSearchComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  options: Array<{
    id: string;
    phone: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
    } | null;
  }>;
}

export const FloatingSearchCombobox = React.forwardRef<HTMLDivElement, FloatingSearchComboboxProps>(
  ({ value, onValueChange, label, options, disabled }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredOptions = options.filter((option) => {
      const fullName = `${option.personalInfo?.firstName} ${option.personalInfo?.lastName}`.toLowerCase();
      const phone = option.phone.toLowerCase();
      const search = searchQuery.toLowerCase();
      return fullName.includes(search) || phone.includes(search);
    });

    return (
      <div className="relative" ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className="w-full justify-between border border-[#663399]/20 rounded-lg h-10"
            >
              {value ? options.find((option) => option.id === value)?.personalInfo?.firstName || "Select person..." : "Select person..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search person..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No person found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => {
                        onValueChange(option.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.personalInfo?.firstName} {option.personalInfo?.lastName} ({option.phone})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Label
          className="absolute left-2 -top-2 z-10 px-2 text-xs text-gray-500 
            transition-all bg-white"
        >
          {label}
        </Label>
      </div>
    );
  }
);
FloatingSearchCombobox.displayName = "FloatingSearchCombobox";

export const FloatingLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "absolute left-2 -top-2 z-10 bg-white px-1 text-xs text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

FloatingLabel.displayName = "FloatingLabel";

