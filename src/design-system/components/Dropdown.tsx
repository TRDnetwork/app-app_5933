import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

/**
 * Reusable Dropdown component with accessible keyboard navigation
 * Supports custom positioning and error states
 */
const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
  position = 'bottom-left',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter out disabled options
  const enabledOptions = options.filter((option) => !option.disabled);
  const selectedIndex = options.findIndex((option) => option.value === value);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? enabledOptions.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev >= enabledOptions.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(enabledOptions[highlightedIndex].value);