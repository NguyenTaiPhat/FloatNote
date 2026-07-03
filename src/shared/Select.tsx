import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@lib/utils';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectProps {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Select({ value, options, onChange, placeholder, className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside both container and dropdown
            const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
            const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

            if (isOutsideContainer && isOutsideDropdown) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isOpen && 'border-primary ring-2 ring-primary/50'
                )}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.icon}
                    <span>{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={cn('text-text-tertiary transition-transform', isOpen && 'rotate-180')}
                />
            </button>

            {/* Dropdown Portal */}
            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                    }}
                    className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-[200] animate-fade-in"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-surface-hover transition-colors',
                                    isSelected && 'bg-primary/10 text-primary'
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon}
                                    <span>{option.label}</span>
                                </div>
                                {isSelected && <Check size={16} className="text-primary" />}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}
