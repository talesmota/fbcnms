function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import * as React from 'react';
import AlarmContext from '../components/AlarmContext';
import MuiStylesThemeProvider from '@material-ui/styles/ThemeProvider';
import defaultTheme from '../theme/default';
import getPrometheusRuleInterface from '../components/rules/PrometheusEditor/getRuleInterface';
import { MemoryRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { act, render } from '@testing-library/react';

/**
 * I don't understand how to properly type these mocks so using any for now.
 * The consuming code is all strongly typed, this shouldn't be much of an issue.
 */
// eslint-disable-next-line flowtype/no-weak-types
export const useMagmaAPIMock = jest.fn((func, params, _cacheCounter) => ({
  isLoading: false,
  response: func(params),
  error: null
}));
/**
 * Make sure when adding new functions to ApiUtil to add their mocks here
 */

export function mockApiUtil(merge) {
  return Object.assign({
    useAlarmsApi: useMagmaAPIMock,
    viewFiringAlerts: jest.fn(),
    viewMatchingAlerts: jest.fn(),
    getTroubleshootingLink: jest.fn(),
    createAlertRule: jest.fn(),
    editAlertRule: jest.fn(),
    getAlertRules: jest.fn(),
    deleteAlertRule: jest.fn(),
    createReceiver: jest.fn(),
    editReceiver: jest.fn(),
    getReceivers: jest.fn(),
    deleteReceiver: jest.fn(),
    getRouteTree: jest.fn(),
    editRouteTree: jest.fn(),
    getSuppressions: jest.fn(),
    getMetricNames: jest.fn(),
    getMetricSeries: jest.fn(),
    getGlobalConfig: jest.fn(),
    editGlobalConfig: jest.fn(),
    getTenants: jest.fn(),
    getAlertmanagerTenancy: jest.fn(),
    getPrometheusTenancy: jest.fn()
  }, merge || {});
} // eslint-disable-next-line flowtype/no-weak-types

export async function renderAsync(...renderArgs) {
  let result;
  await act(async () => {
    result = await render(...renderArgs);
  });
  return result;
}
export function AlarmsWrapper({
  children,
  ...contextProps
}) {
  return /*#__PURE__*/React.createElement(AlarmsTestWrapper, null, /*#__PURE__*/React.createElement(AlarmContext.Provider, {
    value: contextProps
  }, children));
}
export function AlarmsTestWrapper({
  route,
  children
}) {
  return /*#__PURE__*/React.createElement(MemoryRouter, {
    initialEntries: [route || '/'],
    initialIndex: 0
  }, /*#__PURE__*/React.createElement(MuiThemeProvider, {
    theme: defaultTheme
  }, /*#__PURE__*/React.createElement(MuiStylesThemeProvider, {
    theme: defaultTheme
  }, /*#__PURE__*/React.createElement(SnackbarProvider, null, children))));
}

/**
 * All in one function to setup alarm tests.
 * * Constructs a mock apiUtil, mock rule map, and creates an AlarmsWrapper
 * function with both of these mocks passed in as props.
 *
 * Example:
 *
 * const {apiUtil, AlarmsWrapper} = alarmTestUtil()
 * test('my component', () => {
 *   render(
 *    <AlarmsWrapper>
 *      <MyComponent/>
 *    </AlarmsWrapper>
 *   )
 *   expect(apiUtil.someFunction).toHaveBeenCalled();
 * })
 */
export function alarmTestUtil(overrides) {
  var _overrides$apiUtil, _overrides$ruleMap;

  const apiUtil = (_overrides$apiUtil = overrides === null || overrides === void 0 ? void 0 : overrides.apiUtil) !== null && _overrides$apiUtil !== void 0 ? _overrides$apiUtil : mockApiUtil();
  const ruleMap = (_overrides$ruleMap = overrides === null || overrides === void 0 ? void 0 : overrides.ruleMap) !== null && _overrides$ruleMap !== void 0 ? _overrides$ruleMap : getPrometheusRuleInterface({
    apiUtil
  });
  return {
    apiUtil,
    ruleMap,
    AlarmsWrapper: props => /*#__PURE__*/React.createElement(AlarmsWrapper, _extends({
      apiUtil: apiUtil,
      ruleMap: ruleMap
    }, props))
  };
}