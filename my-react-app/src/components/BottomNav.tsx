import { FC, useState } from 'react';
import PromptCategory from './PromptCategory';

interface Category {
  name: string;
  options: string[];
}

interface BottomNavProps {
  askQuestion: (question: string) => void;
  submitGuess: (guessPersonId: string) => void; // Add submitGuess prop
  persons: any[]; // List of all persons available to guess
}

const BottomNav: FC<BottomNavProps> = ({
  askQuestion,
  submitGuess,
  persons,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [generatedQuestion, setGeneratedQuestion] = useState<string | null>(
    null
  );
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null); // Track the selected person guess

  const categories: Category[] = [
    {
      name: 'Hair Style',
      options: ['Bald', 'Curly', 'Wavey', 'Faded', 'Short', 'Braided'],
    },
    {
      name: 'Hair Color',
      options: ['Red', 'Brown', 'Blonde', 'Gray', 'Black', 'Highlighted'],
    },
    {
      name: 'Expression',
      options: ['Happy', 'Sad', 'Scowling', 'Mad', 'Calm/Blank'],
    },
    {
      name: 'Accessories',
      options: ['Watch', 'Glasses', 'a Hat', 'a Scarf', 'Earrings'],
    },
    { name: 'Face', options: ['Beard', 'Mustache', 'Clean face'] },
  ];

  const handleSelectCategory = (name: string, options: string[]) => {
    if (selectedCategory === name) {
      setSelectedCategory(null);
      setSelectedOptions([]);
      setSelectedOptionIndex(null);
      setGeneratedQuestion(null);
    } else {
      setSelectedCategory(name);
      setSelectedOptions(options);
      setSelectedOptionIndex(null);
      setGeneratedQuestion(null); // Reset question when category is changed
    }
  };

  const handleOptionClick = (index: number) => {
    setSelectedOptionIndex(index);
    const selectedOption = selectedOptions[index];
    const question = generateQuestion(selectedCategory!, selectedOption);
    setGeneratedQuestion(question);
  };

  const generateQuestion = (category: string, option: string): string => {
    switch (category) {
      case 'Hair Style':
        return `Does your person have ${option.toLowerCase()} hair?`;
      case 'Hair Color':
        return `Is your person's hair ${option.toLowerCase()}?`;
      case 'Expression':
        return `Is your person ${option.toLowerCase()}?`;
      case 'Accessories':
        return `Is your person wearing ${option.toLowerCase()}?`;
      case 'Face':
        return `Does your person have a ${option.toLowerCase()}?`;
      default:
        return '';
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    minHeight: '50vh', // Reserve space for content
    justifyContent: 'space-between',
  };

  const categoriesRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
  };

  const optionsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    minHeight: '50px', // Reserve space for options
    alignItems: 'center',
  };

  const optionItemStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #aaa',
    borderRadius: '20px',
    backgroundColor: '#ddd',
    color: '#666',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  };

  const optionItemHoverStyle: React.CSSProperties = {
    backgroundColor: '#ccc',
  };

  const optionItemSelectedStyle: React.CSSProperties = {
    backgroundColor: '#bbb',
    color: '#fff',
  };

  const questionContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    position: 'relative',
    width: '100%',
    backgroundColor: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '10px',
    color: '#d3d3d3', // Light gray text
    fontSize: '18px',
    fontWeight: 'bold',
    height: '60px', // Uniform height
  };

  const bottomSectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between', // Align buttons and guess selection on opposite sides
    width: '100%',
    padding: '20px 0',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#d3d3d3', // Light gray background to match theme
    color: '#333', // Darker text for contrast
    border: '1px solid #aaa', // Border similar to the options
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const guessSelectStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '8px',
    width: '200px',
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGuess(event.target.value);
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

      <div style={optionsRowStyle}>
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option, index) => (
            <div
              key={index}
              style={{
                ...optionItemStyle,
                ...(hoveredIndex === index ? optionItemHoverStyle : {}),
                ...(selectedOptionIndex === index
                  ? optionItemSelectedStyle
                  : {}),
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </div>
          ))
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Select a category to see options...
          </div>
        )}
      </div>

      {/* Bottom section: Submit question on the left and guess on the right */}
      <div style={bottomSectionStyle}>
        <div>{generatedQuestion || 'Your question will appear here...'}</div>
        <button
          style={buttonStyle}
          onClick={() => askQuestion(generatedQuestion)}
          disabled={!generatedQuestion}
        >
          Send Question
        </button>

        {/* Select dropdown for making a final guess */}
        <div>
          <select
            style={guessSelectStyle}
            onChange={handleGuessChange}
            value={selectedGuess || ''}
          >
            <option value='' disabled>
              Select your final guess
            </option>
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <button
            style={buttonStyle}
            onClick={() => submitGuess(selectedGuess)}
            disabled={!selectedGuess}
          >
            Submit Guess
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
