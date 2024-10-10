import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label?: string;
  children?: Option[];
  price?: number;
}

interface CascaderProps {
  options: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
}

const Cascader: React.FC<CascaderProps> = ({ options, onChange, placeholder = '请选择' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const cascaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Cascader mounted');
    console.log('Options:', options);
    const handleClickOutside = (event: MouseEvent) => {
      if (cascaderRef.current && !cascaderRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option, level: number) => {
    console.log('Option clicked:', option);
    const newSelectedOptions = [...selectedOptions.slice(0, level), option];
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
    
    if (!option.children) {
      setIsOpen(false);
    }
  };

  const renderOptions = (options: Option[], level: number) => {
    return (
      <ul className="min-w-[160px] max-h-[250px] overflow-y-auto bg-white border-r border-gray-200">
        {options.map((option: Option) => (
          <li
            key={option.value}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
              selectedOptions[level]?.value === option.value ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => handleOptionClick(option, level)}
          >
            <span>{option.label || option.value}</span>
            {option.children && <span className="text-gray-400">▶</span>}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="relative" ref={cascaderRef}>
      <div
        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label || option.value).join(' / ')
            : placeholder}
        </span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md shadow-lg flex">
          {renderOptions(options, 0)}
          {selectedOptions.map((option, index) => 
            option.children && renderOptions(option.children, index + 1)
          )}
        </div>
      )}
    </div>
  );
};

export default Cascader;