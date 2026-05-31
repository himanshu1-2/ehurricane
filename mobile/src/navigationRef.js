import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  if (navigationRef.isReady()) navigationRef.navigate(name, params);
};

export const resetTo = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name, params }] })
    );
  }
};
