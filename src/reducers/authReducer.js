import actionTypes from '../actions/types';

const initializedState = {
  isLoaded: false,
  isLoggedIn: false,
};
const authReducer = (state = initializedState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoaded: false,
        // isLoggedIn: true,
      };
    case actionTypes.LOGIN_ERROR:
      return state;
    default:
      return state;
  }
};

export default authReducer;
