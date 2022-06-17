import actionTypes from '../actions/types';

const initializedState = {
  user: {},
};
const userStateReducer = (state = initializedState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default userStateReducer;
