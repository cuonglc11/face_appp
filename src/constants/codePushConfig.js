import codePush from 'react-native-code-push';

export const codePushConfig = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export const codePushSyncConfig = {
  installMode: codePush.InstallMode.IMMEDIATE,
};

export const codePushStatus = status => {
  switch (status) {
    /**
     * The app is up-to-date with the CodePush server.
     */
    case 0:
      return 'UP_TO_DATE';

    /**
     * An available update has been installed and will be run either immediately after the
     * syncStatusChangedCallback function returns or the next time the app resumes/restarts,
     * depending on the InstallMode specified in SyncOptions
     */
    case 1:
      return 'UPDATE_INSTALLED';

    /**
     * The app had an optional update which the end user chose to ignore.
     * (This is only applicable when the updateDialog is used)
     */
    case 2:
      return 'UPDATE_IGNORED';

    /**
     * The sync operation encountered an unknown error.
     */
    case 3:
      return 'UNKNOWN_ERROR';

    /**
     * There is an ongoing sync operation running which prevents the current call from being executed.
     */
    case 4:
      return 'SYNC_IN_PROGRESS';

    /**
     * The CodePush server is being queried for an update.
     */
    case 5:
      return 'CHECKING_FOR_UPDATE';

    /**
     * An update is available, and a confirmation dialog was shown
     * to the end user. (This is only applicable when the updateDialog is used)
     */
    case 6:
      return 'AWAITING_USER_ACTION';

    /**
     * An available update is being downloaded from the CodePush server.
     */
    case 7:
      return 'DOWNLOADING_PACKAGE';

    /**
     * An available update was downloaded and is about to be installed.
     */
    case 8:
      return 'INSTALLING_UPDATE';

    /**
     * An available update was downloaded and is about to be installed.
     */
    default:
      return 'UNKNOWN_ERROR';
  }
};

export function updateProgress(status) {
  switch (status) {
    /**
     * The CodePush server is being queried for an update.
     */
    case 5:
      return 0;

    /**
     * An available update is being downloaded from the CodePush server.
     */
    case 7:
      return 1;

    /**
     * There is an ongoing sync operation running which prevents the current call from being executed.
     */
    case 4:
    /**
     * An update is available, and a confirmation dialog was shown
     * to the end user. (This is only applicable when the updateDialog is used)
     *
     * caution: fallthrough
     */
    case 6:
      return 2;

    /**
     * An available update was downloaded and is about to be installed.
     */
    case 8:
      return 3;

    /**
     * The app is up-to-date with the CodePush server.
     */
    case 0:
    /**
     * An available update has been installed and will be run either immediately after the
     * syncStatusChangedCallback function returns or the next time the app resumes/restarts,
     * depending on the InstallMode specified in SyncOptions
     *
     * caution: fallthrough
     */
    case 1:
    /**
     * The app had an optional update which the end user chose to ignore.
     * (This is only applicable when the updateDialog is used)
     *
     * caution: fallthrough
     */
    case 2:
    /**
     * The sync operation encountered an unknown error.
     *
     * caution: fallthrough
     */
    case 3:
    default:
      return 4;
  }
}

export function messages(mesCode = '') {
  return mesCode;
}
