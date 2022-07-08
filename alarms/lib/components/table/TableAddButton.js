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
 * The add button at the bottom right of the tables
 */
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  addButton: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: theme.spacing(2)
  }
}));
export default function TableAddButton({
  label,
  onClick,
  ...props
}) {
  const classes = useStyles();
  return /*#__PURE__*/React.createElement(Fab, _extends({}, props, {
    className: classes.addButton,
    color: "primary",
    onClick: onClick,
    "aria-label": label
  }), /*#__PURE__*/React.createElement(AddIcon, null));
}