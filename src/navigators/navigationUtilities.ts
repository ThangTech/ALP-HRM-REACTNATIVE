import {
  createNavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppStackParamList, RouteName } from 'configs/navigation';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string {
  const route = state.routes[state.index as number];

  // Found the active route -- return the name
  if (!route?.state) {
    return route?.name ?? '';
  }

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * use this to navigate without the navigation
 * prop. If you have access to the navigation prop, do not use this.
 * More info: https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */
export function navigate<T extends RouteName>(name: T, params?: AppStackParamList[T]) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}

export function goBack(fallback = RouteName.BottomBarStack) {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
    return;
  }
  fallback && navigate(fallback);
}

export function push<T extends RouteName>(
  name: T,
  params?: T extends keyof AppStackParamList ? AppStackParamList[T] : undefined,
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function replace<T extends RouteName>(
  name: T,
  params?: T extends keyof AppStackParamList ? AppStackParamList[T] : undefined,
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function resetRoot(params?: PartialState<NavigationState> | NavigationState) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params);
  }
}

export function openDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.openDrawer());
  }
}

export function closeDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.closeDrawer());
  }
}

export function useStackNavigation() {
  return useNavigation<StackNavigationProp<AppStackParamList>>();
}
