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
import PrometheusEditor from '../PrometheusEditor';
import { alarmTestUtil } from '../../../../test/testHelpers';
import { parseTimeString } from '../PrometheusEditor';
import { render } from '@testing-library/react';
jest.mock('@fbcnms/ui/hooks/useSnackbar');
jest.mock('@fbcnms/ui/hooks/useRouter');
const {
  AlarmsWrapper,
  apiUtil
} = alarmTestUtil();
const enqueueSnackbarMock = jest.fn();
jest.spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useEnqueueSnackbar').mockReturnValue(enqueueSnackbarMock);
jest.spyOn(require('@fbcnms/ui/hooks/useRouter'), 'default').mockReturnValue({
  match: {
    params: {
      networkId: 'test'
    }
  }
}); // TextField select is difficult to test so replace it with an Input

jest.mock('@material-ui/core/TextField', () => {
  const Input = require('@material-ui/core/Input').default;

  return ({
    children: _,
    InputProps: __,
    label,
    ...props
  }) => /*#__PURE__*/React.createElement("label", null, label, /*#__PURE__*/React.createElement(Input, props));
});
const commonProps = {
  onRuleUpdated: () => {},
  onExit: () => {},
  isNew: false,
  onRuleSaved: jest.fn()
};
test('editing a threshold alert opens the PrometheusEditor with the threshold expression editor enabled', async () => {
  jest.spyOn(apiUtil, 'getMetricSeries').mockResolvedValue([]);
  const testThresholdRule = {
    severity: '',
    ruleType: '',
    rawRule: {
      alert: '',
      expr: 'metric > 123'
    },
    period: '',
    name: '',
    description: '',
    expression: 'metric > 123'
  };
  const {
    getByDisplayValue
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
    thresholdEditorEnabled: true
  }, /*#__PURE__*/React.createElement(PrometheusEditor, _extends({}, commonProps, {
    rule: testThresholdRule
  }))));
  expect(getByDisplayValue('metric')).toBeInTheDocument();
  expect(getByDisplayValue('123')).toBeInTheDocument();
});
test('editing a non-threshold alert opens the PrometheusEditor with the advanced editor enabled', async () => {
  const testThresholdRule = {
    severity: '',
    ruleType: '',
    rawRule: {
      alert: '',
      expr: 'vector(1)'
    },
    period: '',
    name: '',
    description: '',
    expression: 'vector(1)'
  };
  const {
    getByDisplayValue
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
    thresholdEditorEnabled: true
  }, /*#__PURE__*/React.createElement(PrometheusEditor, _extends({}, commonProps, {
    rule: testThresholdRule
  }))));
  expect(getByDisplayValue('vector(1)')).toBeInTheDocument();
});
describe('Duration Parser', () => {
  const testCases = [['empty input', '', {
    hours: 0,
    minutes: 0,
    seconds: 0
  }], ['out of order units', '1s2m3h', {
    hours: 0,
    minutes: 0,
    seconds: 0
  }], ['all units', '1h2m3s', {
    hours: 1,
    minutes: 2,
    seconds: 3
  }], ['hour', '1h', {
    hours: 1,
    minutes: 0,
    seconds: 0
  }], ['minute', '1m', {
    hours: 0,
    minutes: 1,
    seconds: 0
  }], ['second', '1s', {
    hours: 0,
    minutes: 0,
    seconds: 1
  }]];
  test.each(testCases)('%s', (name, input, expectedDuration) => {
    expect(parseTimeString(input)).toEqual(expectedDuration);
  });
});