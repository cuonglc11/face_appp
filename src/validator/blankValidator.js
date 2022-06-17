import Validation from '../utils/validation';

const blankValidator = item => {
  const data = {
    isInputValid: true,
    errorMessage: '',
  };
  data.isInputValid = Validation.required(item.value);
  data.errorMessage = Validation.required(item.value)
    ? ''
    : 'Trường này không được để trống';
  return data;
};

export default blankValidator;
