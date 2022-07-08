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
import ConfigEditor from './ConfigEditor';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
export default function PushoverConfigEditor({
  config,
  onUpdate,
  ...props
}) {
  return /*#__PURE__*/React.createElement(ConfigEditor, _extends({}, props, {
    RequiredFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "User Key",
      value: config.user_key,
      onChange: e => onUpdate({
        user_key: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Token",
      value: config.token,
      onChange: e => onUpdate({
        token: e.target.value
      }),
      fullWidth: true
    }))),
    OptionalFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Title",
      value: config.title,
      onChange: e => onUpdate({
        title: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Message",
      value: config.message,
      onChange: e => onUpdate({
        message: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Priority",
      value: config.priority || '0',
      onChange: e => onUpdate({
        priority: e.target.value
      }),
      fullWidth: true,
      select: true
    }, [['-2', 'Lowest'], ['-1', 'Low'], ['0', 'Normal'], ['1', 'High'], ['2', 'Emergency']].map(([priority, label]) => /*#__PURE__*/React.createElement(MenuItem, {
      key: label,
      value: priority
    }, label))))),
    "data-testid": "email-config-editor"
  }));
}