import {createSelector} from 'reselect';

const appStateSelector = state => state.appState;

export const isCheckedFcm = createSelector(
  [appStateSelector],
  app => app.handleCheckedFcm,
);

export const ipAddressSelector = createSelector(
  [appStateSelector],
  app => app.ipAddress,
);
