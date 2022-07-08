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
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import SeverityIndicator from '../severity/SeverityIndicator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  labelChip: {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.secondary.main,
    margin: '5px'
  },
  titleCell: {
    marginBottom: 2
  },
  secondaryCell: {
    color: theme.palette.text.primary
  },
  secondaryChip: {
    color: theme.palette.secondary.main
  },
  ellipsisChip: {
    display: 'block',
    maxWidth: 256,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  selectableRowHover: {
    cursor: 'pointer'
  },
  darkRow: {
    backgroundColor: theme.palette.grey[100]
  },
  lightRow: {
    backgroundColor: 'white'
  }
}));
const HeadTableCell = withStyles({
  root: {
    fontSize: '12px',
    color: 'gray',
    textTransform: 'capitalize',
    marginLeft: 5
  }
})(TableCell);
const BodyTableCell = withStyles({
  root: {
    fontSize: '14px',
    marginLeft: 5
  }
})(TableCell);

function RenderCell({
  row,
  rowIdx,
  column,
  columnIdx,
  classes
}) {
  const commonProps = {
    classes: classes,
    columnIdx: columnIdx,
    cellKey: `${rowIdx}_${columnIdx}`
  };

  if (typeof column.renderFunc === 'function') {
    return /*#__PURE__*/React.createElement(CustomCell, _extends({}, commonProps, {
      value: column.renderFunc(row, classes)
    }));
  } else {
    /**
     * Since column.render is the discriminator the ColumnData disjoint union,
     * getValue needs to be called individually inside each conditional to work
     * properly. Flow can't know which type getValue will return until after its
     * type has been speciallized by checking against the column.render
     * property.
     */
    if (column.render === 'severity') {
      return /*#__PURE__*/React.createElement(SeverityCell, _extends({}, commonProps, {
        value: column.getValue(row)
      }));
    } else if (column.render === 'multipleGroups') {
      return /*#__PURE__*/React.createElement(MultiGroupsCell, _extends({}, commonProps, {
        value: column.getValue(row)
      }));
    } else if (column.render === 'chip') {
      return /*#__PURE__*/React.createElement(ChipCell, _extends({}, commonProps, {
        value: column.getValue(row)
      }));
    } else if (column.render === 'labels') {
      return /*#__PURE__*/React.createElement(LabelsCell, _extends({}, commonProps, {
        value: column.getValue(row),
        hideFields: column.hideFields
      }));
    } else if (column.render === 'list') {
      return /*#__PURE__*/React.createElement(TextCell, _extends({}, commonProps, {
        value: column.getValue(row).join(', ')
      }));
    } else {
      return /*#__PURE__*/React.createElement(TextCell, _extends({}, commonProps, {
        value: column.getValue(row)
      }));
    }
  }
}

function CustomCell({
  value
}) {
  return /*#__PURE__*/React.createElement(BodyTableCell, null, /*#__PURE__*/React.createElement("div", null, value));
}

function MultiGroupsCell({
  value,
  classes,
  columnIdx
}) {
  return /*#__PURE__*/React.createElement(BodyTableCell, null, value.map((cellValue, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: columnIdx === 0 ? classes.titleCell : classes.secondaryCell
  }, Object.keys(cellValue).map(keyName => /*#__PURE__*/React.createElement(Chip, {
    key: keyName,
    classes: {
      label: classes.ellipsisChip
    },
    className: classes.labelChip,
    label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("em", null, keyName), "=", renderLabelValue(cellValue[keyName])),
    size: "small"
  })))));
}

const renderLabelValue = labelValue => {
  if (typeof labelValue === 'boolean') {
    return labelValue ? 'true' : 'false';
  }

  if (typeof labelValue === 'string' && labelValue.trim() === '') {
    return null;
  }

  return labelValue;
};

function LabelsCell({
  value,
  classes,
  columnIdx,
  hideFields
}) {
  const labels = React.useMemo(() => {
    if (!hideFields) {
      return value;
    }

    const filtered = { ...value
    }; // filter out all keys which are in the hideFields list

    hideFields.forEach(key => delete filtered[key]);
    return filtered;
  }, [value, hideFields]);
  return /*#__PURE__*/React.createElement(BodyTableCell, null, /*#__PURE__*/React.createElement("div", {
    className: columnIdx === 0 ? classes.titleCell : classes.secondaryCell
  }, Object.keys(labels).map(keyName => {
    const val = renderLabelValue(labels[keyName]);
    return /*#__PURE__*/React.createElement(Chip, {
      key: keyName,
      classes: {
        label: classes.ellipsisChip
      },
      className: classes.labelChip,
      label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("em", null, keyName), val !== null && typeof val !== 'undefined' ? '=' : null, val),
      size: "small"
    });
  })));
}

function TextCell({
  value,
  classes,
  columnIdx
}) {
  return /*#__PURE__*/React.createElement(BodyTableCell, null, /*#__PURE__*/React.createElement("div", {
    className: columnIdx === 0 ? classes.titleCell : classes.secondaryCell
  }, value));
}

function SeverityCell({
  value
}) {
  return /*#__PURE__*/React.createElement(BodyTableCell, null, /*#__PURE__*/React.createElement(SeverityIndicator, {
    severity: value
  }));
}

function ChipCell({
  value,
  classes
}) {
  return /*#__PURE__*/React.createElement(BodyTableCell, null, value && /*#__PURE__*/React.createElement(Chip, {
    classes: {
      outlinedPrimary: classes.secondaryChip
    },
    label: value.toUpperCase(),
    color: "primary",
    variant: "outlined",
    "data-chip": value // for testing

  }));
}

export default function SimpleTable(props) {
  const classes = useStyles();
  const {
    columnStruct,
    tableData,
    onActionsClick,
    onRowClick,
    sortFunc: _sortFunc,
    ...extraProps
  } = props;
  const data = tableData || [];
  const rows = data.map((row, rowIdx) => {
    const rowKey = JSON.stringify(row || {});
    return /*#__PURE__*/React.createElement(TableRow, {
      hover: !!onRowClick,
      classes: {
        root: !!onRowClick ? classes.selectableRowHover : undefined
      },
      className: rowIdx % 2 ? classes.lightRow : classes.darkRow,
      key: rowKey,
      onClick: e => {
        e.stopPropagation();

        if (onRowClick) {
          onRowClick(row, rowIdx);
        }
      }
    }, columnStruct.map((column, columnIdx) => /*#__PURE__*/React.createElement(RenderCell, {
      row: row,
      rowIdx: rowIdx,
      column: column,
      columnIdx: columnIdx,
      classes: classes,
      key: `${rowIdx}_${columnIdx}`
    })), onActionsClick && /*#__PURE__*/React.createElement(BodyTableCell, null, /*#__PURE__*/React.createElement(Button, {
      onClick: event => {
        event.stopPropagation();
        onActionsClick(row, event.target);
      },
      "data-testid": "action-menu",
      "aria-label": "Action Menu"
    }, /*#__PURE__*/React.createElement(MoreVertIcon, {
      color: "action"
    }))));
  });
  return /*#__PURE__*/React.createElement(Paper, _extends({}, extraProps, {
    elevation: 1
  }), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, columnStruct.map((column, idx) => /*#__PURE__*/React.createElement(HeadTableCell, {
    key: 'row' + idx
  }, column.title)))), /*#__PURE__*/React.createElement(TableBody, null, rows)));
}
export function toLabels(obj) {
  if (!obj) {
    return {};
  }

  return Object.keys(obj).reduce((map, key) => {
    map[key] = obj[key];
    return map;
  }, {});
}