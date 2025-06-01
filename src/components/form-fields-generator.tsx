// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck

import type { UseFormReturn } from 'react-hook-form';

import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';

import { FIELDS_MAP } from '@/shared/constants';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { cn } from '@/shared/utils';
// import { MultiSelect } from './multi-select';

interface FormGeneratorProps {
  form: UseFormReturn<any>;
  schema: z.ZodObject<any>;
}

// TODO: fix milti-select & fix types & refactor to form-generator & etc.

function isStringTemplate(type: z.ZodAny) {
  if (type instanceof z.ZodString) {
    return true;
  }
  if (type instanceof z.ZodOptional && type._def.innerType instanceof z.ZodString) {
    return true;
  }
  return false;
}

function isEnumTemplate(type: z.ZodAny) {
  if (type instanceof z.ZodEnum) {
    return true;
  }
  if (type instanceof z.ZodOptional && type._def.innerType instanceof z.ZodEnum) {
    return true;
  }
  return false;
}

function isDateTemplate(type: z.ZodAny) {
  if (type instanceof z.ZodDate) {
    return true;
  }
  if (type instanceof z.ZodOptional && type._def.innerType instanceof z.ZodDate) {
    return true;
  }
  return false;
}

export function FormFieldsGenerator({ schema, form }: FormGeneratorProps) {
  const fields = Object.entries(schema.shape).map(([key, value]) => ({
    key: key as keyof typeof FIELDS_MAP,
    type: value as z.ZodAny
  }));

  return (
    <>
      {fields.map(({ key, type }) => (
        <FormField
          key={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FIELDS_MAP[key]}</FormLabel>

              {isStringTemplate(type) && (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              )}

              {isEnumTemplate(type) && (
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {type._def.values
                      ? type._def.values.map((val) => (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        ))
                      : type._def.innerType._def.values.map((val) => (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              )}

              {isDateTemplate(type) && (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        variant={'outline'}
                      >
                        {field.value ? new Date(field.value).toLocaleDateString('ru-RU') : <></>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-auto p-0'>
                    <Calendar
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      selected={field.value}
                      initialFocus
                      mode='single'
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* {type instanceof z.ZodArray ||
                (type instanceof z.ZodOptional && type._def.innerType instanceof z.ZodArray && (
                  <FormControl>
                    <MultiSelect
                      {...field}
                      defaultOptions={type._def.innerType._def.type._def.values?.map((val) => {
                        return {
                          label: val,
                          value: val
                        };
                      })}
                      emptyIndicator={<p className='text-center'>no results found.</p>}
                    />
                  </FormControl>
                ))} */}

              <FormMessage />
            </FormItem>
          )}
          name={key}
          control={form.control}
        />
      ))}
    </>
  );
}
