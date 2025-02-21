"use client";

import { useMemo } from "react";
import {SingleValue} from "react-select";
import CreatebleSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const SelectCreatable = ({
  value,
  onChange,
  onCreate,
  options = [],
  disabled,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatebleSelect 
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      options={options}
      formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
      isDisabled={disabled}
      placeholder={placeholder}
      className="text-sm h-10"
      noOptionsMessage={() => "Nenhum resultado encontrado"}
      styles={{
        control: (base) => ({
          ...base,
          height: '47px',
          borderColor: '#e2e8f0',
          ":hover": {
            borderColor: '#e2e8f0',
          },
          ":focus": {
            borderColor: '#e2e8f0',
          }
        })
      }}
    />
  )
}