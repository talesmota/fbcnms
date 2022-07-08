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
import * as PromQL from '../../prometheus/PromQL';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import RuleEditorBase from '../RuleEditorBase';
import TextField from '@material-ui/core/TextField';
import ToggleableExpressionEditor, { AdvancedExpressionEditor, thresholdToPromQL } from './ToggleableExpressionEditor';
import useForm from '../../../hooks/useForm';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { Labels } from '../../prometheus/PromQL';
import { Parse } from '../../prometheus/PromQLParser';
import { SEVERITY } from '../../severity/Severity';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../../AlarmContext';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: -theme.spacing(0.5),
    margin: theme.spacing(1.5)
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`
  }
}));
const timeUnits = [{
  value: '',
  label: ''
}, {
  value: 's',
  label: 'seconds'
}, {
  value: 'm',
  label: 'minutes'
}, {
  value: 'h',
  label: 'hours'
}];
/**
 * An easier to edit representation of the form's state, then convert
 * to and from the AlertConfig type for posting to the api.
 */

export default function PrometheusEditor(props) {
  const {
    apiUtil,
    thresholdEditorEnabled
  } = useAlarmContext();
  const {
    isNew,
    onRuleUpdated,
    onExit,
    rule
  } = props;
  const {
    match
  } = useRouter();
  const classes = useStyles();
  const snackbars = useSnackbars();
  /**
   * after the user types into the form, map back from FormState and
   * notify the parent component
   */

  const handleFormUpdated = React.useCallback(state => {
    const updatedConfig = toAlertConfig(state);
    onRuleUpdated({ ...rule,
      ...{
        rawRule: updatedConfig
      }
    });
  }, [onRuleUpdated, rule]);
  const {
    formState,
    handleInputChange,
    updateFormState
  } = useForm({
    initialState: fromAlertConfig(rule ? rule.rawRule : null),
    onFormUpdated: handleFormUpdated
  });
  const {
    advancedEditorMode,
    setAdvancedEditorMode,
    thresholdExpression,
    setThresholdExpression
  } = useThresholdExpressionEditorState({
    expression: rule === null || rule === void 0 ? void 0 : rule.expression,
    thresholdEditorEnabled
  });
  /**
   * Handles when the RuleEditorBase form changes, map this from
   * RuleEditorForm -> AlertConfig
   */

  const handleEditorBaseChange = React.useCallback(editorBaseState => {
    updateFormState({
      ruleName: editorBaseState.name,
      description: editorBaseState.description,
      labels: editorBaseState.labels
    });
  }, [updateFormState]);
  const editorBaseInitialState = React.useMemo(() => toBaseFields(rule), [rule]);

  const saveAlert = async () => {
    try {
      if (!formState) {
        throw new Error('Alert config empty');
      }

      const request = {
        networkId: match.params.networkId,
        rule: toAlertConfig(formState)
      };

      if (isNew) {
        await apiUtil.createAlertRule(request);
      } else {
        await apiUtil.editAlertRule(request);
      }

      snackbars.success(`Successfully ${isNew ? 'added' : 'saved'} alert rule`);
      onExit();
    } catch (error) {
      snackbars.error(`Unable to create rule: ${error.response ? error.response.data.message : error.message}.`);
    }
  };

  const updateThresholdExpression = React.useCallback(expression => {
    setThresholdExpression(expression);
    const stringExpression = thresholdToPromQL(expression);
    updateFormState({
      expression: stringExpression
    });
  }, [setThresholdExpression, updateFormState]);
  const severityOptions = React.useMemo(() => Object.keys(SEVERITY).map(key => ({
    key: key,
    value: key,
    children: key.toLowerCase()
  })), []);

  const toggleMode = () => setAdvancedEditorMode(!advancedEditorMode);

  return /*#__PURE__*/React.createElement(RuleEditorBase, {
    initialState: editorBaseInitialState,
    onChange: handleEditorBaseChange,
    onSave: saveAlert,
    onExit: onExit,
    isNew: isNew
  }, advancedEditorMode ? /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(AdvancedExpressionEditor, {
    expression: formState.expression,
    onChange: handleInputChange
  }), /*#__PURE__*/React.createElement(Button, {
    className: classes.button,
    color: "primary",
    size: "small",
    target: "_blank",
    href: "https://prometheus.io/docs/prometheus/latest/querying/basics/"
  }, "PromQL FAQ"), /*#__PURE__*/React.createElement(Button, {
    className: classes.button,
    color: "primary",
    size: "small",
    onClick: toggleMode
  }, "Switch to template")) : /*#__PURE__*/React.createElement(ToggleableExpressionEditor, {
    onChange: handleInputChange,
    onThresholdExpressionChange: updateThresholdExpression,
    expression: thresholdExpression,
    stringExpression: formState.expression,
    toggleOn: advancedEditorMode,
    onToggleChange: toggleMode
  }), /*#__PURE__*/React.createElement(Divider, {
    className: classes.divider
  }), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    alignItems: "flex-start",
    justify: "space-between",
    spacing: 2
  }, /*#__PURE__*/React.createElement(TimeEditor, {
    onChange: handleInputChange,
    timeNumber: formState.timeNumber,
    timeUnit: formState.timeUnit
  }), /*#__PURE__*/React.createElement(SeverityEditor, {
    onChange: handleInputChange,
    options: severityOptions,
    severity: formState.severity
  })));
}
const useSeverityMenuItemStyles = makeStyles(_theme => ({
  root: {
    textTransform: 'capitalize'
  }
}));
const useSeveritySelectStyles = makeStyles(_theme => ({
  root: {
    textTransform: 'capitalize'
  }
}));

function SeverityEditor(props) {
  const severitySelectClasses = useSeveritySelectStyles();
  const severityMenuItemClasses = useSeverityMenuItemStyles();
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 3
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "severity-input"
  }, "Severity"), /*#__PURE__*/React.createElement(TextField, {
    id: "severity-input",
    fullWidth: true,
    required: true,
    select: true,
    value: props.severity,
    onChange: props.onChange(value => ({
      severity: value
    })),
    classes: severitySelectClasses
  }, props.options.map(opt => /*#__PURE__*/React.createElement(MenuItem, _extends({}, opt, {
    ListItemClasses: severityMenuItemClasses
  })))));
}

function TimeEditor(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TimeNumberEditor, {
    onChange: props.onChange,
    timeNumber: props.timeNumber
  }), /*#__PURE__*/React.createElement(TimeUnitEditor, {
    onChange: props.onChange,
    timeUnit: props.timeUnit,
    timeUnits: timeUnits
  }));
}

function TimeNumberEditor(props) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "duration-input"
  }, "Duration"), /*#__PURE__*/React.createElement(Input, {
    id: "duration-input",
    fullWidth: true,
    type: "number",
    value: isNaN(props.timeNumber) ? '' : props.timeNumber,
    onChange: props.onChange(val => ({
      timeNumber: parseInt(val, 10)
    }))
  }), /*#__PURE__*/React.createElement(FormHelperText, null, "Amount of time that conditions are true before an alert is triggered"));
}

function TimeUnitEditor(props) {
  const severitySelectClasses = useSeveritySelectStyles();
  const severityMenuItemClasses = useSeverityMenuItemStyles();
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 3
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "unit-input"
  }, "Unit"), /*#__PURE__*/React.createElement(TextField, {
    id: "unit-input",
    fullWidth: true,
    select: true,
    value: props.timeUnit,
    onChange: props.onChange(val => ({
      timeUnit: val
    })),
    classes: severitySelectClasses
  }, props.timeUnits.map(option => /*#__PURE__*/React.createElement(MenuItem, {
    key: option.value,
    value: option.value,
    classes: severityMenuItemClasses
  }, option.label))));
}

function fromAlertConfig(rule) {
  var _rule$for, _rule$labels, _rule$annotations;

  if (!rule) {
    return {
      ruleName: '',
      expression: '',
      severity: SEVERITY.WARNING.name,
      description: '',
      timeNumber: 0,
      timeUnit: 's',
      labels: {}
    };
  }

  const timeString = (_rule$for = rule.for) !== null && _rule$for !== void 0 ? _rule$for : '';
  const {
    timeNumber,
    timeUnit
  } = getMostSignificantTime(parseTimeString(timeString));
  return {
    ruleName: rule.alert || '',
    expression: rule.expr || '',
    severity: ((_rule$labels = rule.labels) === null || _rule$labels === void 0 ? void 0 : _rule$labels.severity) || '',
    description: ((_rule$annotations = rule.annotations) === null || _rule$annotations === void 0 ? void 0 : _rule$annotations.description) || '',
    timeNumber: timeNumber,
    timeUnit,
    labels: rule.labels || {}
  };
}

function toAlertConfig(form) {
  return {
    alert: form.ruleName,
    expr: form.expression,
    labels: { ...form.labels,
      severity: form.severity
    },
    for: `${form.timeNumber}${form.timeUnit}`,
    annotations: {
      description: form.description
    }
  };
}
/**
 * Map from rule-specific type to the generic RuleEditorBaseFields
 */


export function toBaseFields(rule) {
  var _rule$rawRule;

  return {
    name: (rule === null || rule === void 0 ? void 0 : rule.name) || '',
    description: (rule === null || rule === void 0 ? void 0 : rule.description) || '',
    labels: (rule === null || rule === void 0 ? void 0 : (_rule$rawRule = rule.rawRule) === null || _rule$rawRule === void 0 ? void 0 : _rule$rawRule.labels) || {}
  };
}
export function parseTimeString(timeStamp) {
  if (timeStamp === '') {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  const durationRegex = /^((\d+)h)*((\d+)m)*((\d+)s)*$/;
  const duration = timeStamp.match(durationRegex);

  if (!duration) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  } // Index is corresponding capture group from regex


  const hours = parseInt(duration[2], 10) || 0;
  const minutes = parseInt(duration[4], 10) || 0;
  const seconds = parseInt(duration[6], 10) || 0;
  return {
    hours,
    minutes,
    seconds
  };
}

function getMostSignificantTime(duration) {
  if (duration.hours) {
    return {
      timeNumber: duration.hours,
      timeUnit: 'h'
    };
  } else if (duration.minutes) {
    return {
      timeNumber: duration.minutes,
      timeUnit: 'm'
    };
  }

  return {
    timeNumber: duration.seconds,
    timeUnit: 's'
  };
}

function getThresholdExpression(exp) {
  if (!(exp instanceof PromQL.BinaryOperation && exp.lh instanceof PromQL.InstantSelector && exp.rh instanceof PromQL.Scalar)) {
    return null;
  }

  const metricName = exp.lh.selectorName || '';
  const threshold = exp.rh.value;
  const filters = exp.lh.labels || new PromQL.Labels();
  filters.removeByName('networkID');
  const comparator = asBinaryComparator(exp.operator);

  if (!comparator) {
    return null;
  }

  return {
    metricName,
    filters,
    comparator,
    value: threshold
  };
}

function asBinaryComparator(operator) {
  if (operator instanceof Object) {
    return operator;
  }

  return null;
}

function useThresholdExpressionEditorState({
  expression,
  thresholdEditorEnabled
}) {
  const [thresholdExpression, setThresholdExpression] = React.useState({
    metricName: '',
    comparator: new PromQL.BinaryComparator('=='),
    value: 0,
    filters: new Labels()
  });
  const snackbars = useSnackbars();
  const [advancedEditorMode, setAdvancedEditorMode] = React.useState(!thresholdEditorEnabled); // Parse the expression string once when the component mounts

  const parsedExpression = React.useMemo(() => {
    try {
      return Parse(expression);
    } catch {
      return null;
    } // We only want to parse the expression on the first
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  /**
   * After parsing the expression, caches the threshold expression in state. If
   * the expression cannot be parsed, swaps to the advanced editor mode.
   */

  React.useEffect(() => {
    if (!thresholdEditorEnabled) {
      return;
    }

    if (!expression) {
      setAdvancedEditorMode(false);
    } else if (parsedExpression) {
      const newThresholdExpression = getThresholdExpression(parsedExpression);

      if (newThresholdExpression) {
        setAdvancedEditorMode(false);
        setThresholdExpression(newThresholdExpression);
      } else {
        setAdvancedEditorMode(true);
      }
    } else {
      snackbars.error("Error parsing alert expression. You can still edit this using the advanced editor, but you won't be able to use the UI expression editor.");
    } // we only want this to run when the parsedExpression changes
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [parsedExpression, thresholdEditorEnabled]);
  return {
    thresholdExpression,
    setThresholdExpression,
    advancedEditorMode,
    setAdvancedEditorMode
  };
}