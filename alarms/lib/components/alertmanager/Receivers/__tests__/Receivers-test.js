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
import Receivers from '../Receivers';
import { act, fireEvent, render, wait, waitForElement } from '@testing-library/react';
import { alarmTestUtil, useMagmaAPIMock } from '../../../../test/testHelpers';
const enqueueSnackbarMock = jest.fn();
jest.spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useEnqueueSnackbar').mockReturnValue(enqueueSnackbarMock);
jest.spyOn(require('@fbcnms/ui/hooks/useRouter'), 'default').mockReturnValue({
  match: {
    params: {
      networkId: 'test'
    }
  }
});
const {
  AlarmsWrapper
} = alarmTestUtil();
test('renders', () => {
  render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(Receivers, null)));
});
test('clicking the View button on a row shows the view dialog', async () => {
  useMagmaAPIMock.mockReturnValueOnce({
    response: [{
      name: 'test_receiver',
      slack_configs: [{
        api_url: 'test.com',
        channel: '#test',
        text: '{{text}}',
        title: '{{title}}'
      }]
    }]
  });
  const {
    getByLabelText,
    getByText,
    queryByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(Receivers, null)));
  const actionMenu = getByLabelText(/Action Menu/i);
  expect(actionMenu).toBeInTheDocument();
  act(() => {
    fireEvent.click(actionMenu);
  });
  act(() => {
    fireEvent.click(getByText('View'));
  }); // clicking View should open the dialog

  await waitForElement(() => getByText(/View Receiver/i));
  expect(getByText(/View Receiver/i)).toBeInTheDocument(); // clicking Close should close the dialog

  act(() => {
    fireEvent.click(getByText(/close/i));
  });
  await wait(() => {
    expect(queryByText(/View Receiver/i)).not.toBeInTheDocument();
  });
});
test('clicking edit button should show AddEditReceiver in edit mode', () => {
  useMagmaAPIMock.mockReturnValueOnce({
    response: [{
      name: 'test_receiver',
      slack_configs: [{
        api_url: 'test.com',
        channel: '#test',
        text: '{{text}}',
        title: '{{title}}'
      }]
    }]
  });
  const {
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(Receivers, null)));
  const actionMenu = getByLabelText(/Action Menu/i);
  expect(actionMenu).toBeInTheDocument();
  act(() => {
    fireEvent.click(actionMenu);
  });
  expect(queryByTestId('add-edit-receiver')).not.toBeInTheDocument();
  act(() => {
    fireEvent.click(getByText('Edit'));
  });
  expect(getByTestId('add-edit-receiver')).toBeInTheDocument();
});
test('clicking add button should show AddEditReceiver', () => {
  useMagmaAPIMock.mockReturnValueOnce({
    response: []
  });
  const {
    getByTestId,
    queryByTestId
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(Receivers, null)));
  expect(queryByTestId('add-edit-receiver')).not.toBeInTheDocument();
  act(() => {
    fireEvent.click(getByTestId('add-receiver-button'));
  });
  expect(getByTestId('add-edit-receiver')).toBeInTheDocument();
});