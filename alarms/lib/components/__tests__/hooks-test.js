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
import { AlarmsTestWrapper, alarmTestUtil } from '../../test/testHelpers';
import { act as hooksAct, renderHook } from '@testing-library/react-hooks';
import { mockRuleInterface } from '../../test/testData';
import { useLoadRules, useNetworkId } from '../hooks';
jest.useFakeTimers();
const {
  AlarmsWrapper
} = alarmTestUtil();
const enqueueSnackbarMock = jest.fn();
jest.spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useEnqueueSnackbar').mockReturnValue(enqueueSnackbarMock);
jest.spyOn(require('@fbcnms/ui/hooks/useRouter'), 'default').mockReturnValue({
  match: {
    params: {
      networkId: 'test'
    }
  }
});
describe('useLoadRules hook', () => {
  test('calls all getRules functions and merges their results', async () => {
    // return 2 rules from prometheus and one from events
    const prometheusMock = jest.fn(() => Promise.resolve([mockRule(), mockRule()]));
    const eventsMock = jest.fn(() => Promise.resolve([mockRule()]));
    const ruleMap = {
      prometheus: mockRuleInterface({
        getRules: prometheusMock
      }),
      events: mockRuleInterface({
        getRules: eventsMock
      })
    };
    const {
      result
    } = await renderHookAsync(() => useLoadRules({
      ruleMap,
      lastRefreshTime: ''
    }));
    expect(prometheusMock).toHaveBeenCalled();
    expect(eventsMock).toHaveBeenCalled();
    expect(result.current.rules.length).toBe(3);
  });
  test('if a call errors, a snackbar is enqueued', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    const prometheusMock = jest.fn(() => Promise.resolve([]));
    const eventsMock = jest.fn(() => Promise.reject(new Error('cannot load events')));
    const ruleMap = {
      prometheus: mockRuleInterface({
        getRules: prometheusMock
      }),
      events: mockRuleInterface({
        getRules: eventsMock
      })
    };
    await renderHookAsync(() => useLoadRules({
      ruleMap,
      lastRefreshTime: ''
    }));
    expect(prometheusMock).toHaveBeenCalled();
    expect(eventsMock).toHaveBeenCalled();
    expect(enqueueSnackbarMock).toHaveBeenCalled();
  });
  test('if a call is cancelled or errors, other calls still complete', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    const prometheusMock = jest.fn(() => Promise.resolve([mockRule(), mockRule()]));
    const eventsMock = jest.fn(() => Promise.reject(new Error('cannot load events')));
    const ruleMap = {
      prometheus: mockRuleInterface({
        getRules: prometheusMock
      }),
      events: mockRuleInterface({
        getRules: eventsMock
      })
    };
    const {
      result
    } = await renderHookAsync(() => useLoadRules({
      ruleMap,
      lastRefreshTime: ''
    }));
    expect(prometheusMock).toHaveBeenCalled();
    expect(eventsMock).toHaveBeenCalled();
    expect(result.current.rules).toHaveLength(2);
  });
});
describe('useNetworkId hook', () => {
  it('returns match.params.networkId by default', () => {
    const {
      result
    } = renderHook(() => useNetworkId(), {
      wrapper: ({
        children
      }) => /*#__PURE__*/React.createElement(AlarmsTestWrapper, null, /*#__PURE__*/React.createElement(AlarmsWrapper, null, children))
    });
    expect(result.current).toBe('test');
  });
  it('returns AlarmsContext.getNetworkId if provided', () => {
    const {
      result
    } = renderHook(() => useNetworkId(), {
      wrapper: ({
        children
      }) => /*#__PURE__*/React.createElement(AlarmsTestWrapper, null, /*#__PURE__*/React.createElement(AlarmsWrapper, {
        getNetworkId: () => 'getnetworkid-test'
      }, children))
    });
    expect(result.current).toBe('getnetworkid-test');
  });
});

function mockRule() {
  return {
    severity: '',
    name: '',
    description: '',
    period: '',
    expression: '',
    ruleType: '',
    rawRule: {}
  };
}

async function renderHookAsync(renderFn) {
  let response;
  await hooksAct(async () => {
    response = await renderHook(renderFn);
  });

  if (response == null) {
    throw new Error('render failed');
  }

  return response;
}