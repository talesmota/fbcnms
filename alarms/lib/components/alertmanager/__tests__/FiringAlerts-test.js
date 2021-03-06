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
import FiringAlerts from '../FiringAlerts';
import { act, fireEvent, render } from '@testing-library/react';
import { alarmTestUtil } from '../../../test/testHelpers';
const {
  apiUtil,
  AlarmsWrapper
} = alarmTestUtil();
test('renders with default props', () => {
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(FiringAlerts, null)));
  expect(getByText(/Start creating alert rules/i)).toBeInTheDocument();
  expect(getByText(/Add Alert Rule/i)).toBeInTheDocument();
});
test('renders firing alerts', () => {
  const firingAlarms = [{
    labels: {
      alertname: '<<testalert>>',
      severity: 'INFO'
    }
  }];
  jest.spyOn(apiUtil, 'viewFiringAlerts').mockReturnValue(firingAlarms);
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(FiringAlerts, null)));
  expect(getByText('<<testalert>>')).toBeInTheDocument();
  expect(getByText(/info/i)).toBeInTheDocument();
});
test('clicking view alert shows alert details pane', async () => {
  const firingAlarms = [{
    labels: {
      alertname: '<<testalert>>',
      severity: 'INFO'
    }
  }];
  jest.spyOn(apiUtil, 'viewFiringAlerts').mockReturnValue(firingAlarms);
  const {
    getByText,
    getByTestId
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(FiringAlerts, null)));
  act(() => {
    fireEvent.click(getByText('<<testalert>>'));
  });
  expect(getByTestId('alert-details-pane')).toBeInTheDocument();
});