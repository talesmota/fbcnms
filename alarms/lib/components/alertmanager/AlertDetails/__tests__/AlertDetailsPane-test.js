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
import AlertDetailsPane from '../AlertDetailsPane';
import { act, fireEvent, render } from '@testing-library/react';
import { alarmTestUtil } from '../../../../test/testHelpers';
import { mockAlert, mockRuleInterface } from '../../../../test/testData';
const {
  apiUtil,
  AlarmsWrapper
} = alarmTestUtil();
const commonProps = {
  alert: mockAlert({
    labels: {
      alertname: '<<test alert>>'
    }
  }),
  onClose: jest.fn()
};
describe('Basics', () => {
  test('renders with default props', () => {
    const {
      getByText,
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, commonProps)));
    expect(getByTestId('alert-details-pane')).toBeInTheDocument();
    expect(getByTestId('metric-alert-viewer')).toBeInTheDocument();
    expect(getByText('<<test alert>>')).toBeInTheDocument();
  });
  test('clicking the close button invokes onclose callback', () => {
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, commonProps)));
    const closeButton = getByTestId('alert-details-close');
    expect(closeButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(commonProps.onClose).toHaveBeenCalled();
  });
  test('shows extra labels', () => {
    const alert = mockAlert({
      labels: {
        testLabel: 'testValue'
      }
    });
    const {
      getByText
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
      alert: alert
    }))));
    expect(getByText(/testLabel/i)).toBeInTheDocument();
    expect(getByText(/testValue/i)).toBeInTheDocument();
  });
  test('shows extra annotations', () => {
    const alert = mockAlert({
      annotations: {
        testAnnotation: 'testValue'
      }
    });
    const {
      getByText
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
      alert: alert
    }))));
    expect(getByText(/testAnnotation/i)).toBeInTheDocument();
    expect(getByText(/testValue/i)).toBeInTheDocument();
  });
});
test('shows troubleshooting link', () => {
  const alert = mockAlert({
    labels: {
      testLabel: 'testValue'
    }
  });
  jest.spyOn(apiUtil, 'getTroubleshootingLink').mockReturnValue({
    link: 'www.example.com',
    title: 'View troubleshooting documentation'
  });
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
    alert: alert
  }))));
  expect(getByText(/View troubleshooting documentation/i)).toBeInTheDocument();
});
describe('Alert type selection', () => {
  test('by default, use the MetricAlertViewer', () => {
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, null, /*#__PURE__*/React.createElement(AlertDetailsPane, commonProps)));
    expect(getByTestId('metric-alert-viewer')).toBeInTheDocument();
  });
  test('if getAlertType returns an unconfigured alert source, ' + 'fallback to the default', () => {
    const getAlertTypeMock = jest.fn(() => 'unconfigured-source');
    const alert = mockAlert();
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
      getAlertType: getAlertTypeMock
    }, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
      alert: alert
    }))));
    expect(getAlertTypeMock).toHaveBeenCalledWith(alert);
    expect(getByTestId('metric-alert-viewer')).toBeInTheDocument();
  });
  test('if getAlertType returns a alert source without an AlertViewer, ' + 'fallback to default', () => {
    const getAlertTypeMock = jest.fn(() => 'prometheus');
    const alert = mockAlert();
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
      getAlertType: getAlertTypeMock
    }, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
      alert: alert
    }))));
    expect(getAlertTypeMock).toHaveBeenCalledWith(alert);
    expect(getByTestId('metric-alert-viewer')).toBeInTheDocument();
  });
  test('if getAlertType returns an alert source with an AlertViewer, ' + 'renders the AlertViewer', () => {
    const mockAlertType = 'test';
    const getAlertTypeMock = jest.fn(() => mockAlertType);

    function MockAlertViewer(_props) {
      return /*#__PURE__*/React.createElement("div", {
        "data-testid": "mock-alert-viewer"
      });
    }

    const alert = mockAlert();
    const {
      getByTestId
    } = render( /*#__PURE__*/React.createElement(AlarmsWrapper, {
      getAlertType: getAlertTypeMock,
      ruleMap: {
        [mockAlertType]: mockRuleInterface({
          AlertViewer: MockAlertViewer
        })
      }
    }, /*#__PURE__*/React.createElement(AlertDetailsPane, _extends({}, commonProps, {
      alert: alert
    }))));
    expect(getAlertTypeMock).toHaveBeenCalledWith(alert);
    expect(getByTestId('mock-alert-viewer')).toBeInTheDocument();
  });
});