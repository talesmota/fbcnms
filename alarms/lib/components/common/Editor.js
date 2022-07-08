function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 *
 * Wrappper component for editors such as AddEditRule, AddEditReceiver, etc
 */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  gridContainer: {
    flexGrow: 1
  },
  editingSpace: {
    height: '100%',
    padding: theme.spacing(3)
  }
}));
export default function Editor({
  children,
  isNew,
  onExit,
  onSave,
  title,
  description,
  ...props
}) {
  const classes = useStyles();
  return /*#__PURE__*/React.createElement(Grid, _extends({}, props, {
    className: classes.gridContainer,
    container: true,
    spacing: 0
  }), /*#__PURE__*/React.createElement(Grid, {
    className: classes.editingSpace,
    item: true,
    xs: true
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSave();
    },
    "data-testid": "editor-form"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    spacing: 4,
    direction: "column",
    wrap: "nowrap"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    wrap: "nowrap",
    xs: 12
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5",
    noWrap: true
  }, title), /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    noWrap: true
  }, description)), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    spacing: 1,
    xs: 6,
    justify: "flex-end",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    onClick: () => onExit()
  }, "Close")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    color: "primary",
    type: "submit",
    "data-testid": "editor-submit-button"
  }, isNew ? 'Add' : 'Save')))), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    spacing: 3
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    direction: "column",
    spacing: 2,
    wrap: "nowrap",
    xs: 12
  }, children))))));
}