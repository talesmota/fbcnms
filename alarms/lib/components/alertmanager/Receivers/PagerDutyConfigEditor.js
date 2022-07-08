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
export default function PagerDutyConfigEditor({
  config,
  onUpdate,
  ...props
}) {
  return /*#__PURE__*/React.createElement(ConfigEditor, _extends({}, props, {
    RequiredFields: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Description",
      value: config.description,
      onChange: e => onUpdate({
        description: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Severity",
      value: config.severity,
      onChange: e => onUpdate({
        severity: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
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
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Routing_key",
      value: config.routing_key,
      onChange: e => onUpdate({
        routing_key: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Service_key",
      value: config.service_key,
      onChange: e => onUpdate({
        service_key: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Client",
      value: config.client,
      onChange: e => onUpdate({
        client: e.target.value
      }),
      fullWidth: true
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(TextField, {
      required: true,
      label: "Client Url",
      value: config.client_url,
      onChange: e => onUpdate({
        client_url: e.target.value
      }),
      fullWidth: true
    }))),
    "data-testid": "pager-duty-config-editor"
  }));
}