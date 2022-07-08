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
 * Base component for rule editors to render. Handles rendering common elements
 * such as receiver config and label editor.
 */
import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Editor from '../common/Editor';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import LabelsEditor from './LabelsEditor';
import RuleContext from './RuleContext';
import SelectReceiver from '../alertmanager/Receivers/SelectReceiver';
import SelectRuleType from './SelectRuleType';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useForm from '../../hooks/useForm';
import { useAlarmContext } from '../AlarmContext';
import { useAlertRuleReceiver } from '../hooks';
export default function RuleEditorBase({
  isNew,
  children,
  initialState,
  onChange,
  onSave,
  ...props
}) {
  const {
    apiUtil
  } = useAlarmContext();
  const ruleContext = React.useContext(RuleContext);
  const {
    formState,
    handleInputChange,
    updateFormState
  } = useForm({
    initialState: initialState || defaultState(),
    onFormUpdated: onChange
  });
  const {
    receiver,
    setReceiver,
    saveReceiver
  } = useAlertRuleReceiver({
    ruleName: (formState === null || formState === void 0 ? void 0 : formState.name) || '',
    apiUtil
  });
  const handleSave = React.useCallback(async () => {
    await onSave();
    await saveReceiver();
  }, [saveReceiver, onSave]);
  const handleLabelsChange = React.useCallback(labels => {
    updateFormState({
      labels
    });
  }, [updateFormState]);
  return /*#__PURE__*/React.createElement(Editor, _extends({}, props, {
    title: "Add Alert Rule",
    description: "Create a new rule to be alerted of important changes in the network",
    isNew: isNew,
    onSave: handleSave
  }), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    spacing: 4
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    item: true,
    xs: 7,
    spacing: 4
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Summary"
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, {
    id: "rulename",
    disabled: !isNew,
    required: true,
    label: "Rule Name",
    placeholder: "Ex: Link down",
    fullWidth: true,
    value: formState.name,
    onChange: handleInputChange(val => ({
      name: val
    }))
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, {
    disabled: !isNew,
    label: "Description",
    placeholder: "Ex: The link is down",
    fullWidth: true,
    value: formState.description,
    onChange: handleInputChange(val => ({
      description: val
    }))
  }))))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Conditions"
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 4
  }, isNew && /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(SelectRuleType, {
    ruleMap: ruleContext.ruleMap,
    value: ruleContext.ruleType,
    onChange: ruleContext.selectRuleType
  })), children))))), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    item: true,
    spacing: 4,
    xs: 5
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
      variant: "h5",
      gutterBottom: true
    }, "Notifications"), /*#__PURE__*/React.createElement(Typography, {
      color: "textSecondary",
      gutterBottom: true,
      variant: "body2"
    }, "Select who will be contacted when this rule triggers an alert"))
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, null, "Audience"), /*#__PURE__*/React.createElement(SelectReceiver, {
    fullWidth: true,
    receiver: receiver,
    onChange: setReceiver
  })))))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(LabelsEditor, {
    labels: formState.labels,
    onChange: handleLabelsChange
  })))));
}

function defaultState() {
  return {
    name: '',
    description: '',
    labels: {}
  };
}