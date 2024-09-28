import { FC } from 'react';

interface PromptCategoryProps {
  name: string;
  selected: boolean;
  onSelect: () => void;
}

const PromptCategory: FC<PromptCategoryProps> = ({
  name,
  selected,
  onSelect,
}) => {
  const styles = {
    nameContainer: {
      display: 'inline-block',
      padding: '10px 20px',
      borderRadius: '30px',
      border: '2px solid',
      cursor: 'pointer',
      marginRight: '10px',
      backgroundColor: selected ? '#fff' : '#333',
      color: selected ? '#333' : '#fff',
      borderColor: '#888',
      fontWeight: 'bold',
      transition: 'all 0.3s ease-in-out',
    },
  };

  return (
    <div style={styles.nameContainer} onClick={onSelect}>
      {name}
    </div>
  );
};

export default PromptCategory;
