import { useState, useRef, useEffect } from 'react';
import { definitions } from '../data/definitions';

interface TooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function Tooltip({ term, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const definition = definitions[term];
  if (!definition) return <>{children || term}</>;

  return (
    <span className="tooltip-wrapper" ref={ref}>
      <button
        type="button"
        className="tooltip-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {children || term}
        <span className="tooltip-icon" aria-hidden="true">?</span>
      </button>
      {open && (
        <span className="tooltip-popover" role="tooltip">
          <span className="tooltip-term">{term}</span>
          <span className="tooltip-def">{definition}</span>
        </span>
      )}
    </span>
  );
}
