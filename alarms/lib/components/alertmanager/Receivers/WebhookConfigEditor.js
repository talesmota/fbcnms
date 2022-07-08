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
import TextField from '@material-ui/core/TextField';
export default function WebhookConfigEditor({
  config,
  onUpdate,
  ...props
}) {
  return /*#__PURE__*/React.createElement(ConfigEditor, _extends({}, props, {
    RequiredFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Url",
      placeholder: "Ex: webhook.example.com",
      value: config.url,
      onChange: e => onUpdate({
        url: e.target.value
      }),
      fullWidth: true
    }))),
    "data-testid": "webhook-config-editor"
  }));
}