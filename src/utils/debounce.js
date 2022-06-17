const debounce = (func, period) => {
  let timeoutID = null;

  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func(...args), period);
  };
};

export default debounce;
