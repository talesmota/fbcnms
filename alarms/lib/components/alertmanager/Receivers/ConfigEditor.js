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
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  configEditor: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingBottom: theme.spacing(4)
    }
  }
}));
export default function ConfigEditor({
  onDelete,
  onReset,
  RequiredFields,
  OptionalFields,
  isNew
}) {
  const classes = useStyles();
  const [optionalFieldsExpanded, setOptionalFieldsExpanded] = React.useState(false);
  const handleExpandClick = React.useCallback(() => setOptionalFieldsExpanded(x => !x), [setOptionalFieldsExpanded]);
  return /*#__PURE__*/React.createElement(Grid, {
    className: classes.configEditor,
    container: true,
    item: true,
    justify: "space-between",
    xs: 12,
    alignItems: "flex-start"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    spacing: 2,
    direction: "column",
    wrap: "nowrap",
    xs: 11
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12
  }, RequiredFields), OptionalFields && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(ButtonBase, {
    onClick: handleExpandClick,
    disableTouchRipple: true
  }, /*#__PURE__*/React.createElement(Typography, {
    color: "primary",
    variant: "body2"
  }, !optionalFieldsExpanded ? 'Show' : 'Hide', " advanced options"))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(Collapse, {
    in: optionalFieldsExpanded,
    timeout: "auto",
    unmountOnExit: true
  }, OptionalFields)))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1,
    container: true,
    justify: "flex-end"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(EditorMenuButton, {
    onReset: onReset,
    onDelete: onDelete,
    isNew: isNew
  }))));
} // menu button for top right of card

function EditorMenuButton({
  onReset,
  onDelete,
  isNew
}) {
  const iconRef = React.useRef();
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RootRef, {
    rootRef: iconRef
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "editor-menu",
    edge: "end",
    onClick: () => setMenuOpen(true)
  }, /*#__PURE__*/React.createElement(MoreVertIcon, null))), /*#__PURE__*/React.createElement(Menu, {
    anchorEl: iconRef.current,
    open: isMenuOpen,
    onClose: () => setMenuOpen(false)
  }, !isNew && /*#__PURE__*/React.createElement(MenuItem, {
    onClick: () => {
      onReset();
      setMenuOpen(false);
    }
  }, "Reset"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: () => {
      onDelete();
      setMenuOpen(false);
    }
  }, "Delete")));
}