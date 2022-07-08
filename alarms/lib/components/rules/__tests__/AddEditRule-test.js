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
import AddEditRule from '../AddEditRule';
import RuleEditorBase from '../RuleEditorBase';
import nullthrows from '../../../util/nullthrows';
import { act, fireEvent, render } from '@testing-library/react';
import { alarmTestUtil, renderAsync } from '../../../test/testHelpers';
import { assertType } from '../../../util/assert';
import { mockPrometheusRule } from '../../../test/testData';
import { toBaseFields } from '../PrometheusEditor/PrometheusEditor';
const mockRuleMap = {
  mock: {
    RuleEditor: MockRuleEditor,
    deleteRule: jest.fn(),
    getRules: jest.fn(),
    friendlyName: 'mock'
  }
};
const {
  apiUtil,
  AlarmsWrapper
} = alarmTestUtil({
  ruleMap: mockRuleMap
});
const commonProps = {
  isNew: false,
  initialConfig: mockPrometheusRule({
    name: 'TESTRULE',
    ruleType: 'mock'
  }),
  onExit: jest.fn()
};
afterEach(() => {
  jest.resetAllMocks();
});
describe('Receiver select', () => {
  test('a rule with a receiver selected sets the receiver select value', async () => {
    mockUseAlarms();
    jest.spyOn(apiUtil, 'getReceivers').mockImplementation(() => [{
      name: 'test_receiver'
    }]);
    jest.spyOn(apiUtil, 'getRouteTree').mockReturnValue({
      receiver: 'network_base_route',
      routes: [{
        receiver: 'test_receiver',
        match: {
          alertname: 'TESTRULE'
        }
      }]
    });
    const {
      getByTestId
    } = await renderAsync( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AddEditRule, _extends({}, commonProps, {
      initialConfig: mockPrometheusRule({
        name: 'TESTRULE',
        ruleType: 'mock'
      })
    }))));
    const select = getByTestId('select-receiver');
    expect(select.textContent).toBe('test_receiver');
  });
  test('selecting a receiver sets the value in the select box', () => {
    mockUseAlarms();
    jest.spyOn(apiUtil, 'getReceivers').mockReturnValue([{
      name: 'test_receiver'
    }, {
      name: 'new_receiver'
    }]);
    jest.spyOn(apiUtil, 'getRouteTree').mockReturnValue({
      receiver: 'network_base_route',
      routes: [{
        receiver: 'test_receiver',
        match: {
          alertname: 'TESTRULE'
        }
      }]
    });
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AddEditRule, commonProps)));
    const selectReceiver = getByTestId('select-receiver-input');
    act(() => {
      fireEvent.change(selectReceiver, {
        target: {
          value: 'new_receiver'
        }
      });
    });
    const receiverInput = assertType(getByTestId('select-receiver-input'), HTMLInputElement);
    expect(receiverInput.value).toBe('new_receiver');
  });
  test('setting a receiver adds a new route', async () => {
    mockUseAlarms();
    jest.spyOn(apiUtil, 'getReceivers').mockReturnValue([{
      name: 'test_receiver'
    }]);
    jest.spyOn(apiUtil, 'getRouteTree').mockReturnValue({
      receiver: 'network_base_route',
      routes: []
    });
    const editRouteTreeMock = jest.spyOn(apiUtil, 'editRouteTree');
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AddEditRule, commonProps)));
    const selectReceiver = getByTestId('select-receiver-input');
    act(() => {
      fireEvent.change(selectReceiver, {
        target: {
          value: 'test_receiver'
        }
      });
    });
    await act(async () => {
      fireEvent.submit(getByTestId('editor-form'));
    });
    expect(editRouteTreeMock).toHaveBeenCalledWith({
      networkId: undefined,
      route: {
        receiver: 'network_base_route',
        routes: [{
          receiver: 'test_receiver',
          match: {
            alertname: 'TESTRULE'
          }
        }]
      }
    });
  });
  test('selecting a new receiver updates an existing route', async () => {
    mockUseAlarms();
    jest.spyOn(apiUtil, 'getReceivers').mockReturnValue([{
      name: 'test_receiver'
    }, {
      name: 'new_receiver'
    }]);
    jest.spyOn(apiUtil, 'getRouteTree').mockReturnValue({
      receiver: 'network_base_route',
      routes: [{
        receiver: 'test_receiver',
        match: {
          alertname: 'TESTRULE'
        }
      }]
    });
    const editRouteTreeMock = jest.spyOn(apiUtil, 'editRouteTree');
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AddEditRule, commonProps)), {
      baseElement: nullthrows(document.body)
    });
    const selectReceiver = getByTestId('select-receiver-input');
    act(() => {
      fireEvent.change(selectReceiver, {
        target: {
          value: 'new_receiver'
        }
      });
    });
    await act(async () => {
      fireEvent.submit(getByTestId('editor-form'));
    });
    expect(editRouteTreeMock).toHaveBeenCalledWith({
      networkId: undefined,
      route: {
        receiver: 'network_base_route',
        routes: [{
          receiver: 'new_receiver',
          match: {
            alertname: 'TESTRULE'
          }
        }]
      }
    });
  });
  test('un-selecting receiver removes the existing route', async () => {
    mockUseAlarms();
    jest.spyOn(apiUtil, 'getReceivers').mockReturnValue([{
      name: 'test_receiver'
    }, {
      name: 'new_receiver'
    }]);
    jest.spyOn(apiUtil, 'getRouteTree').mockReturnValue({
      receiver: 'network_base_route',
      routes: [{
        receiver: 'test_receiver',
        match: {
          alertname: 'TESTRULE'
        }
      }]
    });
    const editRouteTreeMock = jest.spyOn(apiUtil, 'editRouteTree');
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AddEditRule, commonProps)), {
      baseElement: nullthrows(document.body)
    });
    const selectReceiver = getByTestId('select-receiver-input');
    act(() => {
      // select option None
      fireEvent.change(selectReceiver, {
        target: {
          value: ''
        }
      });
    });
    await act(async () => {
      fireEvent.submit(getByTestId('editor-form'));
    });
    expect(editRouteTreeMock).toHaveBeenCalledWith({
      networkId: undefined,
      route: {
        receiver: 'network_base_route',
        routes: []
      }
    });
  });
});

function MockRuleEditor(props) {
  const {
    isNew,
    rule
  } = props;
  return /*#__PURE__*/React.createElement(RuleEditorBase, {
    isNew: isNew,
    onSave: jest.fn(),
    onExit: jest.fn(),
    onChange: jest.fn(),
    initialState: toBaseFields(rule)
  }, /*#__PURE__*/React.createElement("span", null));
}

function mockUseAlarms() {
  jest.spyOn(apiUtil, 'useAlarmsApi').mockImplementation((fn, params) => {
    return {
      response: fn(params)
    };
  });
}