import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    let timeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
        timeout = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeout);
        setIsVisible(false);
    };

    const positions = {
        top: 'bottom-full left-0 mb-2',
        bottom: 'top-full left-0 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-[100] px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap pointer-events-none ${positions[position]}`}
                    >
                        {content}
                        <div className="absolute w-2 h-2 bg-gray-900 rotate-45"
                            style={{
                                top: position === 'bottom' ? '-4px' : undefined,
                                bottom: position === 'top' ? '-4px' : undefined,
                                left: position === 'right' ? '-4px' : position === 'left' ? undefined : '20px',
                                right: position === 'left' ? '-4px' : undefined,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
