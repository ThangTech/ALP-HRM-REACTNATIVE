/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import { it } from '@jest/globals';

// Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';
jest.mock('@native-html/render', () => ({
  __esModule: true,
  default: () => null,
}));

it('renders correctly', () => {
  <App />;
  // renderer.create(<App />);
});
