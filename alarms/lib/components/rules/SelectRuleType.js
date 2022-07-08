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
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/styles';
const useRuleTypeStyles = makeStyles(theme => ({
  buttonGroup: {
    paddingTop: theme.spacing(1)
  },
  button: {
    textTransform: 'capitalize'
  },
  label: {
    fontSize: theme.typography.pxToRem(14)
  }
}));
export default function SelectRuleType({
  ruleMap,
  value,
  onChange
}) {
  const classes = useRuleTypeStyles();
  const ruleTypes = React.useMemo(() => Object.keys(ruleMap || {}).map(key => ({
    type: key,
    friendlyName: ruleMap[key].friendlyName || key
  })), [ruleMap]);
  const handleChange = React.useCallback((_e, val) => {
    onChange(val);
  }, [onChange]); // if there's < 2 rule types, just stick with the default rule type

  if (ruleTypes.length < 2) {
    return null;
  }
  /**
   * Grid structure is chosen here to match the selected editor's width
   * and padding.
   */


  return /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, {
    className: classes.label
  }, "Rule Type"), /*#__PURE__*/React.createElement(ToggleButtonGroup, {
    className: classes.buttonGroup,
    size: "medium",
    color: "primary",
    variant: "outlined",
    value: value,
    onChange: handleChange,
    exclusive: true
  }, ruleTypes.map(ruleType => /*#__PURE__*/React.createElement(ToggleButton, {
    className: classes.button,
    key: ruleType.type,
    value: ruleType.type
  }, ruleType.friendlyName))));
}