/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import Grid from '@material-ui/core/Grid';
import React from 'react';
import RuleContext from './RuleContext';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../AlarmContext';
import { useState } from 'react';
const useStyles = makeStyles(_theme => ({
  gridContainer: {
    flexGrow: 1
  }
}));
export default function AddEditRule(props) {
  const {
    ruleMap
  } = useAlarmContext();
  const {
    isNew,
    onExit
  } = props;
  const classes = useStyles();
  const [rule, setRule] = useState(props.initialConfig);
  const [selectedRuleType, setSelectedRuleType] = React.useState((rule === null || rule === void 0 ? void 0 : rule.ruleType) || props.defaultRuleType || 'prometheus'); // null out in-progress rule so next editor doesnt see an incompatible schema

  const selectRuleType = React.useCallback(type => {
    setRule(null);
    return setSelectedRuleType(type);
  }, [setRule, setSelectedRuleType]);
  const {
    RuleEditor
  } = ruleMap[selectedRuleType];
  return /*#__PURE__*/React.createElement(RuleContext.Provider, {
    value: {
      ruleMap: ruleMap,
      ruleType: selectedRuleType,
      selectRuleType: selectRuleType
    }
  }, /*#__PURE__*/React.createElement(Grid, {
    className: classes.gridContainer,
    container: true,
    spacing: 0,
    "data-testid": "add-edit-alert"
  }, /*#__PURE__*/React.createElement(RuleEditor, {
    isNew: isNew,
    onExit: onExit,
    onRuleUpdated: setRule,
    rule: rule
  })));
}