'use client';

import { COUNTRIES } from '@/config/countries';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { FormControl } from './ui/form';
import Image from 'next/image';
import {
  FieldValues,
  UseControllerReturn,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

export type SelectedCountry = (typeof COUNTRIES)[number];

const CountrySelector = (props: FieldValues) => {
  const { onChange, value } = props;

  const selectedValue = COUNTRIES.find(
    option => option.value === value || option.value === 'PT'
  ) as SelectedCountry;

  return (
    <Select
      onValueChange={onChange}
      defaultValue={value}>
      <FormControl>
        <SelectTrigger>
          <Image
            alt={`${selectedValue.value}`}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedValue.value}.svg`}
            width={24}
            height={16}
            className={'inline mr-2 h-4 rounded-sm'}
          />
          {selectedValue.title}
        </SelectTrigger>
      </FormControl>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}>
          <SelectContent>
            {COUNTRIES.map((option, index) => (
              <SelectItem
                key={`country-selector-option-${index}`}
                id="listbox-option-0"
                value={option.value}>
                <Image
                  alt={`${option.value}`}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${option.value}.svg`}
                  width={24}
                  height={16}
                  className={'inline mr-2 h-4 rounded-sm'}
                />
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </motion.div>
      </AnimatePresence>
    </Select>
  );
};

export default CountrySelector;
