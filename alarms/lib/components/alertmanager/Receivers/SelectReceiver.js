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
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { useAlarmContext } from '../../AlarmContext';
export default function SelectReceiver({
  onChange,
  receiver,
  ...fieldProps
}) {
  const {
    apiUtil
  } = useAlarmContext();
  const {
    match
  } = useRouter();
  const {
    isLoading,
    error,
    response
  } = apiUtil.useAlarmsApi(apiUtil.getReceivers, {
    networkId: match.params.networkId
  });
  const handleChange = React.useCallback(e => {
    onChange(e.target.value);
  }, [onChange]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(CircularProgress, {
      size: 20
    });
  }

  return /*#__PURE__*/React.createElement(Select, _extends({}, fieldProps, {
    id: "select-receiver",
    "data-testid": "select-receiver",
    onChange: handleChange,
    defaultValue: "Select Team",
    inputProps: {
      'data-testid': 'select-receiver-input'
    },
    renderValue: value => /*#__PURE__*/React.createElement(Chip, {
      key: value,
      label: value,
      variant: "outlined",
      color: "primary",
      size: "small"
    }),
    value: receiver || ''
  }), /*#__PURE__*/React.createElement(MenuItem, {
    value: "",
    key: ''
  }, "None"), error && /*#__PURE__*/React.createElement(MenuItem, null, "Error: Could not load receivers"), (response || []).map(receiver => /*#__PURE__*/React.createElement(MenuItem, {
    value: receiver.name,
    key: receiver.name
  }, receiver.name)));
}