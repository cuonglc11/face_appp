import {createSelector} from 'reselect';

const userStateSelector = state => state.userState;

export const userLoginSelector = createSelector(
  [userStateSelector],
  userState => userState.user,
);
