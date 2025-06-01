import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { X } from 'lucide-react';
import * as React from 'react';

import { useDebounceValue } from '@/shared/hooks';
import { Badge } from '@/shared/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '@/shared/ui/command';
import { cn } from '@/shared/utils';

interface Option {
  /** Group the options by providing key. */
  [key: string]: boolean | string | undefined;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  label: string;
  value: string;
}
interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  badgeClassName?: string;
  className?: string;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  defaultOptions?: Option[];
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  disabled?: boolean;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Group the options base on provided key. */
  groupBy?: string;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   */
  triggerSearchOnFocus?: boolean;
  value?: Option[];
  onChange?: (options: Option[]) => void;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   */
  onSearchSync?: (value: string) => Option[];
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'disabled' | 'placeholder' | 'value'
  >;
}

interface MultipleSelectorRef {
  input: HTMLInputElement;
  selectedValue: Option[];
  focus: () => void;
  reset: () => void;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      '': options
    };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || '';
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
  }
  return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true;
    }
  }
  return false;
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 */
const CommandEmpty = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=''
      role='presentation'
      {...props}
    />
  );
};

const MultiSelect = ({
  ref,
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false
}: MultipleSelectorProps & { ref?: React.RefObject<MultipleSelectorRef | null> }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [onScrollbar, setOnScrollbar] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null); // Added this

  const [selected, setSelected] = React.useState<Option[]>(value || []);

  const [options, setOptions] = React.useState<GroupOption>(() =>
    transToGroupOption(arrayDefaultOptions, groupBy)
  );
  const [inputValue, setInputValue] = React.useState('');
  const debouncedSearchTerm = useDebounceValue(inputValue, delay || 500);

  React.useImperativeHandle(
    ref,
    () => ({
      selectedValue: [...selected],
      input: inputRef.current as HTMLInputElement,
      focus: () => inputRef?.current?.focus(),
      reset: () => setSelected([])
    }),
    [selected]
  );

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newOptions = selected.filter((s) => s.value !== option.value);
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            // If there is a last item and it is not fixed, we can remove it.
            if (lastSelectOption && !lastSelectOption.fixed) {
              handleUnselect(lastSelectOption);
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [handleUnselect, selected]
  );

  React.useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [open]);

  React.useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  React.useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

  React.useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;

      if (triggerSearchOnFocus) {
        doSearchSync();
      }

      if (debouncedSearchTerm) {
        doSearchSync();
      }
    };

    void exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  React.useEffect(() => {
    /** async search */

    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;

      if (triggerSearchOnFocus) {
        await doSearch();
      }

      if (debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  const CreatableItem = () => {
    if (!creatable) return undefined;
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find((s) => s.value === inputValue)
    ) {
      return undefined;
    }

    const Item = (
      <CommandItem
        className='cursor-pointer'
        value={inputValue}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue('');
          const newOptions = [...selected, { value, label: value }];
          setSelected(newOptions);
          onChange?.(newOptions);
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // For normal creatable
    if (!onSearch && inputValue.length > 0) {
      return Item;
    }

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return Item;
    }

    return undefined;
  };

  const EmptyItem = React.useCallback(() => {
    if (!emptyIndicator) return undefined;

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem disabled value='-'>
          {emptyIndicator}
        </CommandItem>
      );
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  const selectables = React.useMemo<GroupOption>(
    () => removePickedOption(options, selected),
    [options, selected]
  );

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = React.useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }

    if (creatable) {
      return (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      };
    }
    // Using default filter in `cmdk`. We don't have to provide it.
    return undefined;
  }, [creatable, commandProps?.filter]);

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
      filter={commandFilter()}
      onKeyDown={(e) => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      }}
      shouldFilter={
        commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
      } // When onSearch is provided, we don't want to filter the options. You can still override it.
    >
      <div
        className={cn(
          'min-h-10 rounded-md border border-input text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm',
          {
            'px-3 py-2': selected.length !== 0,
            'cursor-text': !disabled && selected.length !== 0
          },
          className
        )}
        onClick={() => {
          if (disabled) return;
          inputRef?.current?.focus();
        }}
      >
        <div className='relative flex flex-wrap gap-1'>
          {selected.map((option) => {
            return (
              <Badge
                key={option.value}
                className={cn(
                  'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                  'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',
                  badgeClassName
                )}
                data-disabled={disabled || undefined}
                data-fixed={option.fixed}
              >
                {option.label}
                <button
                  className={cn(
                    'ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    (disabled || option.fixed) && 'hidden'
                  )}
                  type='button'
                  onClick={() => handleUnselect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
              {
                'w-full': hidePlaceholderWhenSelected,
                'px-3 py-2': selected.length === 0,
                'ml-1': selected.length !== 0
              },
              inputProps?.className
            )}
            disabled={disabled}
            value={inputValue}
            onBlur={(event) => {
              if (!onScrollbar) {
                setOpen(false);
              }
              inputProps?.onBlur?.(event);
            }}
            onFocus={(event) => {
              setOpen(true);
              inputProps?.onFocus?.(event);
            }}
            onValueChange={(value) => {
              setInputValue(value);
              inputProps?.onValueChange?.(value);
            }}
            placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
          />
          <button
            className={cn(
              'absolute h-6 w-6 p-0 ltr:right-0 rtl:left-0',
              (hideClearAllButton ||
                disabled ||
                selected.length < 1 ||
                selected.filter((s) => s.fixed).length === selected.length) &&
                'hidden'
            )}
            type='button'
            onClick={() => {
              setSelected(selected.filter((s) => s.fixed));
              onChange?.(selected.filter((s) => s.fixed));
            }}
          >
            <X />
          </button>
        </div>
      </div>
      <div className='relative'>
        {open && (
          <CommandList
            className='absolute top-1 z-10 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none'
            onMouseEnter={() => {
              setOnScrollbar(true);
            }}
            onMouseLeave={() => {
              setOnScrollbar(false);
            }}
            onMouseUp={() => {
              inputRef?.current?.focus();
            }}
          >
            {isLoading ? (
              <>{loadingIndicator}</>
            ) : (
              <>
                {EmptyItem()}
                {CreatableItem()}
                {!selectFirstItem && <CommandItem className='hidden' value='-' />}
                {Object.entries(selectables).map(([key, dropdowns]) => (
                  <CommandGroup key={key} className='h-full overflow-auto' heading={key}>
                    <>
                      {dropdowns.map((option) => {
                        return (
                          <CommandItem
                            key={option.value}
                            className={cn(
                              'cursor-pointer',
                              option.disable && 'cursor-default text-muted-foreground'
                            )}
                            disabled={option.disable}
                            value={option.label}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              if (selected.length >= maxSelected) {
                                onMaxSelected?.(selected.length);
                                return;
                              }
                              setInputValue('');
                              const newOptions = [...selected, option];
                              setSelected(newOptions);
                              onChange?.(newOptions);
                            }}
                          >
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </>
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  );
};

export { MultiSelect };
