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
import MuiStylesThemeProvider from '@material-ui/styles/ThemeProvider';
import SimpleTable from '../SimpleTable';
import defaultTheme from '../../../theme/default';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { act, fireEvent, render } from '@testing-library/react';
afterEach(() => {
  jest.resetAllMocks();
}); // replace the default chip with a more easily queryable version

jest.mock('@material-ui/core/Chip', () => ({
  label,
  ...props
}) => /*#__PURE__*/React.createElement("div", _extends({
  "data-chip": true
}, props, {
  children: label
})));

function Wrapper(props) {
  return /*#__PURE__*/React.createElement(MuiThemeProvider, {
    theme: defaultTheme
  }, /*#__PURE__*/React.createElement(MuiStylesThemeProvider, {
    theme: defaultTheme
  }, props.children));
}

test('renders with required default props', () => {
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
    columnStruct: mockColumns(),
    tableData: []
  })));
  expect(getByText('name')).toBeInTheDocument();
  expect(getByText('age')).toBeInTheDocument();
});
test('rendered row is transformed by path expression', () => {
  const rows = [{
    name: 'bob',
    labels: {
      description: 'bob description'
    }
  }, {
    name: 'mary',
    labels: {
      description: 'mary description'
    }
  }];
  const {
    getByText,
    ..._result
  } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
    columnStruct: [{
      title: 'name',
      getValue: x => x.name
    }, {
      title: 'description',
      getValue: row => {
        var _row$labels;

        return (_row$labels = row.labels) === null || _row$labels === void 0 ? void 0 : _row$labels.description;
      }
    }],
    tableData: rows
  })));
  expect(getByText('name')).toBeInTheDocument();
  expect(getByText('description')).toBeInTheDocument();
  expect(getByText('bob')).toBeInTheDocument();
  expect(getByText('bob description')).toBeInTheDocument();
  expect(getByText('mary')).toBeInTheDocument();
  expect(getByText('mary description')).toBeInTheDocument();
});
test('if onActionsClick is not passed, no actions menu is rendered', () => {
  const {
    queryByLabelText,
    queryByText
  } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
    columnStruct: mockColumns(),
    tableData: [{
      name: 'name',
      age: 'age'
    }]
  })));
  expect(queryByLabelText(/Action Menu/i)).not.toBeInTheDocument(); // table column should also not be rendered

  expect(queryByText('actions')).not.toBeInTheDocument();
});
test('if onActionsClick is passed, actions menu is rendered', () => {
  const actionsMenuMock = jest.fn();
  const {
    getByLabelText,
    getByTestId
  } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
    columnStruct: mockColumns(),
    tableData: [{
      name: 'name',
      age: 'age'
    }],
    onActionsClick: actionsMenuMock
  })));
  const button = getByLabelText(/Action Menu/i);
  expect(button).toBeInTheDocument();
  act(() => {
    fireEvent.click(button);
  }); // clicking the actions menu button should invoke onActionsClick

  expect(actionsMenuMock).toHaveBeenCalled(); // expect the actions column to exist

  expect(getByTestId('action-menu')).toBeInTheDocument();
});
describe('column renderers', () => {
  test('if cell value is an object, renders label chips', () => {
    const {
      container
    } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
      columnStruct: [{
        title: 'labels',
        getValue: row => row.labels,
        render: 'labels'
      }],
      tableData: [{
        labels: {
          name: 'name',
          age: 'age'
        }
      }]
    })));
    /**
     * Replace the default material-ui chip with one which passes an
     * easily queryable identifier to ensure that a chip is rendered.
     */

    const chips = container.querySelectorAll('[data-chip]'); // ensure that 2 chips are rendered

    expect(chips.length).toBe(2);
    /**
     * chip text is broken up by multiple elements. textContent combines text
     * from all children so we can check for that instead.
     */

    const textContent = [].map.call(chips, chip => chip.textContent);
    expect(textContent).toContain('name=name');
    expect(textContent).toContain('age=age');
  });
  test('if column render is "severity", severity cell is rendered', () => {
    const {
      getByText
    } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
      columnStruct: [{
        title: 'severity',
        getValue: row => row.severity,
        render: 'severity'
      }],
      tableData: [{
        severity: 'minor'
      }, {
        severity: 'major'
      }]
    })));
    expect(getByText('major')).toBeInTheDocument();
    expect(getByText('minor')).toBeInTheDocument();
  });
  test('if column render is "chip", chip cell is rendered', () => {
    const {
      container
    } = render( /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(SimpleTable, {
      columnStruct: [{
        title: 'type',
        getValue: row => row.type,
        render: 'chip'
      }],
      tableData: [{
        type: 'slack'
      }, {
        type: 'pagerduty'
      }]
    })));
    expect(container.querySelector('[data-chip="slack"]')).toBeInTheDocument();
    expect(container.querySelector('[data-chip="pagerduty"]')).toBeInTheDocument();
  });
});

function mockColumns() {
  return [{
    title: 'name',
    getValue: row => row.name
  }, {
    title: 'age',
    getValue: row => row.age
  }];
}