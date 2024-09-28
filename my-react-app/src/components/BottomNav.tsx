import { FC, useState } from 'react';
import PromptCategory from './PromptCategory';

interface Category {
  name: string;
  options: string[];
}

const BottomNav: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Keep track of which option is hovered

  const categories: Category[] = [
    {
      name: 'Hair Style',
      options: ['Bald', 'Curly', 'Wavey', 'Fade', 'Short'],
    },
    {
      name: 'Hair Color',
      options: ['Red', 'Brown', 'Blonde', 'Gray', 'Highlights'],
    },
    {
      name: 'Expression',
      options: ['Happy', 'Sad', 'Scowling', 'Mad', 'Blank'],
    },
    {
      name: 'Accessories',
      options: ['Watch', 'Glasses', 'Hat', 'Scarf', 'Earrings'],
    },
    { name: 'Facial Hair', options: ['Yes', 'No'] },
  ];

  const handleSelectCategory = (name: string, options: string[]) => {
    if (selectedCategory === name) {
      setSelectedCategory(null);
      setSelectedOptions([]);
    } else {
      setSelectedCategory(name);
      setSelectedOptions(options);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
  };

  const categoriesRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
  };

  const optionsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  };

  const optionItemStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #aaa', // Use a more muted border color
    borderRadius: '20px',
    backgroundColor: '#ddd', // Subdued background color
    color: '#666', // Muted text color
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Add a slight shadow to give depth
    transition: 'background-color 0.3s ease', // Smooth transition for background color
  };

  const optionItemHoverStyle: React.CSSProperties = {
    backgroundColor: '#ccc', // Darken slightly on hover
  };

  return (
    <div style={containerStyle}>
      <div style={categoriesRowStyle}>
        {categories.map((category) => (
          <PromptCategory
            key={category.name}
            name={category.name}
            selected={selectedCategory === category.name}
            onSelect={() =>
              handleSelectCategory(category.name, category.options)
            }
          />
        ))}
      </div>

      {/* Render options horizontally below the pills if a category is selected */}
      {selectedCategory && (
        <div style={optionsRowStyle}>
          {selectedOptions.map((option, index) => (
            <div
              key={index}
              style={{
                ...optionItemStyle,
                ...(hoveredIndex === index ? optionItemHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BottomNav;
