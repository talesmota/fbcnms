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
import ClipboardLink from '../../components/ClipboardLink';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  paper: {
    minWidth: 360
  },
  pre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  }
}));
export default function TableActionDialog(props) {
  const {
    open,
    onClose,
    title,
    additionalContent,
    row,
    showCopyButton,
    showDeleteButton,
    onDelete,
    RowViewer
  } = props;
  const classes = useStyles();

  if (!row) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Dialog, {
    PaperProps: {
      classes: {
        root: classes.paper
      }
    },
    open: open,
    onClose: onClose
  }, /*#__PURE__*/React.createElement(DialogTitle, null, title), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(RowViewer, {
    row: row
  }), additionalContent), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: onClose,
    color: "primary"
  }, showDeleteButton ? 'Cancel' : 'Close'), showCopyButton && /*#__PURE__*/React.createElement(ClipboardLink, null, ({
    copyString
  }) => /*#__PURE__*/React.createElement(Button, {
    onClick: () => copyString(JSON.stringify(row) || ''),
    color: "primary",
    variant: "contained"
  }, "Copy")), showDeleteButton && /*#__PURE__*/React.createElement(Button, {
    onClick: onDelete,
    color: "primary",
    variant: "contained"
  }, "Delete")));
}
TableActionDialog.defaultProps = {
  RowViewer: SimpleJsonViewer
};
const useJsonStyles = makeStyles(() => ({
  pre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  }
}));
export function SimpleJsonViewer({
  row
}) {
  const classes = useJsonStyles();
  return /*#__PURE__*/React.createElement("pre", {
    className: classes.pre
  }, JSON.stringify(row, null, 2));
}