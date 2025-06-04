import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: number[];
  onChange: (selectedIds: number[]) => void;
  className?: string;
}

const TagSelector = ({ 
  availableTags, 
  selectedTags, 
  onChange, 
  className = '' 
}: TagSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !selectedTags.includes(tag.id)
  );

  const handleSelect = (tagId: number) => {
    onChange([...selectedTags, tagId]);
    setSearchQuery('');
  };

  const handleRemove = (tagId: number) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const getSelectedTags = () => {
    return availableTags.filter(tag => selectedTags.includes(tag.id));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white dark:bg-gray-800 min-h-[42px]">
        {getSelectedTags().map(tag => (
          <div 
            key={tag.id} 
            className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm"
          >
            {tag.name}
            <button 
              type="button"
              onClick={() => handleRemove(tag.id)} 
              className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={selectedTags.length ? "Ajouter d'autres tags..." : "Ajouter des tags..."}
              className="border-0 bg-transparent focus:outline-none p-1 text-sm min-w-[120px]"
            />
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-500 dark:text-gray-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {isDropdownOpen && filteredTags.length > 0 && (
            <div 
              className="absolute z-10 mt-1 w-64 max-h-48 overflow-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg"
              onBlur={() => setIsDropdownOpen(false)}
            >
              {filteredTags.map(tag => (
                <div 
                  key={tag.id} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                  onClick={() => {
                    handleSelect(tag.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;