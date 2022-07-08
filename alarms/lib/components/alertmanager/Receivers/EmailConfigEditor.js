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
import Checkbox from '@material-ui/core/Checkbox';
import ConfigEditor from './ConfigEditor';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
export default function EmailConfigEditor({
  config,
  onUpdate,
  ...props
}) {
  return /*#__PURE__*/React.createElement(ConfigEditor, _extends({}, props, {
    RequiredFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Send To",
      placeholder: "Ex: ops@example.com",
      value: config.to,
      onChange: e => onUpdate({
        to: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "From",
      placeholder: "Ex: notifications@example.com",
      value: config.from,
      onChange: e => onUpdate({
        from: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Host",
      placeholder: "Ex: smtp.example.com",
      value: config.smarthost,
      onChange: e => onUpdate({
        smarthost: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Auth Username",
      value: config.auth_username,
      onChange: e => onUpdate({
        auth_username: e.target.value
      }),
      fullWidth: true,
      helperText: "SMTP Auth using CRAM-MD5, LOGIN and PLAIN"
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Auth Password",
      value: config.auth_password,
      onChange: e => onUpdate({
        auth_password: e.target.value
      }),
      fullWidth: true,
      helperText: "SMTP Auth using LOGIN and PLAIN"
    }))),
    OptionalFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Auth Secret",
      value: config.auth_secret,
      onChange: e => onUpdate({
        auth_secret: e.target.value
      }),
      fullWidth: true,
      helperText: "SMTP Auth using CRAM-MD5"
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Auth Identity",
      value: config.auth_identity,
      onChange: e => onUpdate({
        auth_identity: e.target.value
      }),
      fullWidth: true,
      helperText: "SMTP Auth using PLAIN"
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(FormControlLabel, {
      control: /*#__PURE__*/React.createElement(Checkbox, {
        checked: config.require_tls,
        onChange: e => onUpdate({
          require_tls: e.target.checked
        }),
        name: "require_tls",
        color: "primary",
        indeterminate: config.require_tls == null
      }),
      label: "Require TLS"
    }))),
    "data-testid": "email-config-editor"
  }));
}