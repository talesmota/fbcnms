/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import 'jest-dom/extend-expect';
import * as React from 'react';
import AlertRules from '../AlertRules';
import { act, fireEvent, render } from '@testing-library/react';
import { alarmTestUtil } from '../../test/testHelpers';
import { assertType } from '../../util/assert';
import { mockPrometheusRule } from '../../test/testData';
jest.mock('@fbcnms/ui/hooks/useSnackbar');
jest.mock('@fbcnms/ui/hooks/useRouter');
const {
  apiUtil,
  AlarmsWrapper
} = alarmTestUtil();
jest.spyOn(apiUtil, 'getMetricSeries').mockResolvedValue([]);
const snackbarsMock = {
  error: jest.fn(),
  success: jest.fn()
};
jest.spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useSnackbars').mockReturnValue(snackbarsMock);
jest.spyOn(require('@fbcnms/ui/hooks/useRouter'), 'default').mockReturnValue({
  match: {
    params: {
      networkId: 'test'
    }
  }
});
const useLoadRulesMock = jest.spyOn(require('../hooks'), 'useLoadRules').mockImplementation(jest.fn(() => ({
  rules: [],
  isLoading: false
}))); // TextField select is difficult to test so replace it with an Input

jest.mock('@material-ui/core/TextField', () => {
  const Input = require('@material-ui/core/Input').default;

  return ({
    children: _,
    InputProps: __,
    select: _sel,
    label,
    ...props
  }) => /*#__PURE__*/React.createElement("label", null, label, /*#__PURE__*/React.createElement(Input, props));
});
const axiosMock = jest.spyOn(require('axios'), 'default').mockImplementation(jest.fn(() => Promise.resolve({
  data: {}
})));
test('renders rules returned by api', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [mockPrometheusRule()],
    isLoading: false
  });
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertRules, null)));
  expect(getByText('<<test>>')).toBeInTheDocument();
  expect(getByText('UP == 0 for 1m')).toBeInTheDocument();
});
test('clicking the add alert icon displays the AddEditAlert view', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [mockPrometheusRule()],
    isLoading: false
  });
  const {
    queryByTestId,
    getByTestId
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertRules, null)));
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument(); // click the add alert rule fab

  act(() => {
    fireEvent.click(getByTestId('add-edit-alert-button'));
  });
  expect(getByTestId('add-edit-alert')).toBeInTheDocument();
});
test('clicking close button when AddEditAlert is open closes the panel', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [],
    isLoading: false
  });
  const {
    queryByTestId,
    getByTestId,
    getByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertRules, null)));
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument(); // click the add alert rule fab

  act(() => {
    fireEvent.click(getByTestId('add-edit-alert-button'));
  });
  expect(getByTestId('add-edit-alert')).toBeInTheDocument();
  act(() => {
    fireEvent.click(getByText(/close/i));
  });
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument();
});
test('clicking the "edit" button in the table menu opens AddEditAlert for that alert', async () => {
  const resp = {
    rules: [mockPrometheusRule()],
    isLoading: false
  };
  useLoadRulesMock.mockReturnValueOnce(resp);
  const {
    getByText,
    getByLabelText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertRules, null))); // open the table row menu

  act(() => {
    fireEvent.click(getByLabelText(/action menu/i));
  }); // click the edit buton

  act(() => {
    fireEvent.click(getByText(/edit/i));
  });
  const ruleNameInput = assertType(getByLabelText(/rule name/i), HTMLInputElement);
  expect(ruleNameInput.value).toBe('<<test>>');
});
/**
 * Test AlertRules' integration with AddEditAlert. It passes in a specific
 * columnStruct object so we need to test that this works properly.
 */

describe('AddEditAlert > Prometheus Editor', () => {
  test('Filling the form and clicking Add will post to the endpoint', async () => {
    const createAlertRuleMock = jest.spyOn(apiUtil, 'createAlertRule');
    useLoadRulesMock.mockReturnValueOnce({
      rules: [mockPrometheusRule()],
      isLoading: false
    });
    const {
      getByTestId,
      getByLabelText
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
      thresholdEditorEnabled: false
    }, /*#__PURE__*/React.createElement(AlertRules, null)));
    act(() => {
      fireEvent.click(getByTestId('add-edit-alert-button'));
    });
    act(() => {
      fireEvent.change(getByLabelText(/rule name/i), {
        target: {
          value: '<<ALERTNAME>>'
        }
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/severity/i), {
        target: {
          value: 'minor'
        }
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/duration/i), {
        target: {
          value: '1'
        }
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/unit/i), {
        target: {
          value: 'm'
        }
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/expression/i), {
        target: {
          value: 'vector(1) == 0'
        }
      });
    }); // This triggers an async call so must be awaited

    await act(async () => {
      fireEvent.submit(getByTestId('editor-form'));
    });
    expect(createAlertRuleMock.mock.calls[0][0]).toMatchObject({
      networkId: 'test',
      rule: {
        alert: '<<ALERTNAME>>',
        labels: {
          severity: 'minor'
        },
        for: '1m',
        expr: 'vector(1) == 0'
      }
    });
  });
  test('a snackbar is enqueued if adding a rule fails', async () => {
    axiosMock.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          message: 'an error message'
        }
      }
    });
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertRules, null)));
    act(() => {
      fireEvent.click(getByTestId('add-edit-alert-button'));
    });
    await act(async () => {
      fireEvent.submit(getByTestId('editor-form'));
    });
    expect(snackbarsMock.success).toHaveBeenCalled();
  });
});