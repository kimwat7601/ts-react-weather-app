import { type FC, useState } from 'react';
import InputText from '@/components/common/InputText';

type SearchForm = {
  handleSearch: (inputValue: string) => void;
};

const SearchForm: FC<SearchForm> = ({ handleSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newInputValue = inputValue.trim();
    if (newInputValue === '') return;
    handleSearch(newInputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="dashboard-header__inner">
        <InputText
          className="form-input__text"
          id="ipt-city-search"
          placeholder="都市名・郵便番号を入力"
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchForm;
