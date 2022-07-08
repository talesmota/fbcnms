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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { LABEL_OPERATORS } from '../../prometheus/PromQLTypes';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../../AlarmContext';
import { useNetworkId } from '../../../components/hooks';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: -theme.spacing(0.5),
    margin: theme.spacing(1.5)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  helpButton: {
    color: 'black'
  },
  labeledToggleSwitch: {
    paddingBottom: 0
  },
  metricFilterItem: {
    marginRight: theme.spacing(1)
  }
}));
export function thresholdToPromQL(thresholdExpression) {
  if (!thresholdExpression.comparator || !thresholdExpression.metricName) {
    return '';
  }

  const {
    metricName,
    comparator,
    filters,
    value
  } = thresholdExpression;
  const metricSelector = new PromQL.InstantSelector(metricName, filters);
  const exp = new PromQL.BinaryOperation(metricSelector, new PromQL.Scalar(value), comparator);
  return exp.toPromQL();
}
export default function ToggleableExpressionEditor(props) {
  const {
    apiUtil
  } = useAlarmContext();
  const snackbars = useSnackbars();
  const networkId = useNetworkId();
  const {
    response,
    error
  } = apiUtil.useAlarmsApi(apiUtil.getMetricNames, {
    networkId
  });

  if (error) {
    snackbars.error('Error retrieving metrics: ' + error);
  }

  return /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(ThresholdExpressionEditor, {
    onChange: props.onThresholdExpressionChange,
    expression: props.expression,
    metricNames: response !== null && response !== void 0 ? response : [],
    onToggleChange: props.onToggleChange
  }));
}
export function AdvancedExpressionEditor(props) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "metric-advanced-input"
  }, "Expression"), /*#__PURE__*/React.createElement(TextField, {
    id: "metric-advanced-input",
    required: true,
    placeholder: "SNR >= 0",
    value: props.expression,
    onChange: props.onChange(value => ({
      expression: value
    })),
    fullWidth: true
  }));
}

function ConditionSelector(props) {
  const conditions = ['>', '<', '==', '>=', '<=', '!='];
  return /*#__PURE__*/React.createElement(Grid, null, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "condition-input"
  }, "Condition"), /*#__PURE__*/React.createElement(TextField, {
    id: "condition-input",
    fullWidth: true,
    required: true,
    select: true,
    value: props.expression.comparator.op,
    onChange: ({
      target
    }) => {
      props.onChange({ ...props.expression,
        comparator: new PromQL.BinaryComparator( // Cast to element type of conditions as it's item type
        target.value)
      });
    }
  }, conditions.map(item => /*#__PURE__*/React.createElement(MenuItem, {
    key: item,
    value: item
  }, item))));
}

function ValueSelector(props) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "value-input"
  }, "Value"), /*#__PURE__*/React.createElement(TextField, {
    id: "value-input",
    fullWidth: true,
    value: props.expression.value,
    type: "number",
    onChange: ({
      target
    }) => {
      props.onChange({ ...props.expression,
        value: parseFloat(target.value)
      });
    }
  }));
}

function MetricSelector(props) {
  const {
    metricNames
  } = props;
  return /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "metric-input"
  }, "Metric"), /*#__PURE__*/React.createElement(Autocomplete, {
    id: "metric-input",
    options: metricNames,
    groupBy: getMetricNamespace,
    value: props.expression.metricName,
    onChange: (_e, value) => {
      props.onChange({ ...props.expression,
        metricName: value
      });
    },
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      required: true
    }))
  }));
}

function ThresholdExpressionEditor({
  expression,
  onChange,
  onToggleChange,
  metricNames
}) {
  const networkId = useNetworkId();
  const {
    apiUtil
  } = useAlarmContext();
  const {
    metricName
  } = expression; // mapping from label name to all values in response

  const [labels, setLabels] = React.useState(new Map()); // cache all label names

  const labelNames = React.useMemo(() => getFilteredListOfLabelNames(Array.from(labels.keys())), [labels]);
  React.useEffect(() => {
    async function getMetricLabels() {
      const response = await apiUtil.getMetricSeries({
        name: metricName,
        networkId: networkId
      });
      const labelValues = new Map();

      for (const metric of response) {
        for (const labelName of Object.keys(metric)) {
          let set = labelValues.get(labelName);

          if (!set) {
            set = new Set();
            labelValues.set(labelName, set);
          }

          const labelValue = metric[labelName];
          set.add(labelValue);
        }
      }

      setLabels(labelValues);
    }

    if (metricName != null && metricName !== '') {
      getMetricLabels();
    }
  }, [metricName, networkId, setLabels, apiUtil]);
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    spacing: 1
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    spacing: 1,
    alignItems: "flex-end",
    justify: "space-between"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 7
  }, /*#__PURE__*/React.createElement(MetricSelector, {
    expression: expression,
    onChange: onChange,
    metricNames: metricNames
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 3
  }, /*#__PURE__*/React.createElement(ConditionSelector, {
    expression: expression,
    onChange: onChange
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 2
  }, /*#__PURE__*/React.createElement(ValueSelector, {
    expression: expression,
    onChange: onChange
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(MetricFilters, {
    labelNames: labelNames,
    labelValues: labels,
    expression: expression,
    onChange: onChange,
    onToggleChange: onToggleChange
  })));
}

function MetricFilters(props) {
  var _props$expression, _props$expression2;

  const classes = useStyles();
  const isMetricSelected = ((_props$expression = props.expression) === null || _props$expression === void 0 ? void 0 : _props$expression.metricName) != null && ((_props$expression2 = props.expression) === null || _props$expression2 === void 0 ? void 0 : _props$expression2.metricName) !== '';
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    className: classes.button,
    color: "primary",
    size: "small",
    disabled: !isMetricSelected,
    onClick: () => {
      const filtersCopy = props.expression.filters.copy();
      filtersCopy.addEqual('', '');
      props.onChange({ ...props.expression,
        filters: filtersCopy
      });
    }
  }, "Add new filter"), /*#__PURE__*/React.createElement(Button, {
    className: classes.button,
    color: "primary",
    size: "small",
    onClick: props.onToggleChange
  }, "Write a custom expression")), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    spacing: 3
  }, props.expression.filters.labels.map((filter, idx) => /*#__PURE__*/React.createElement(Grid, {
    item: true,
    key: idx
  }, /*#__PURE__*/React.createElement(LabelFilter, {
    labelNames: props.labelNames,
    labelValues: props.labelValues,
    onChange: props.onChange,
    onRemove: filterIdx => {
      const filtersCopy = props.expression.filters.copy();
      filtersCopy.remove(filterIdx);
      props.onChange({ ...props.expression,
        filters: filtersCopy
      });
    },
    expression: props.expression,
    filterIdx: idx,
    selectedLabel: filter.name,
    selectedValue: filter.value
  })))));
}

function LabelFilter(props) {
  var _props$labelValues$ge;

  const currentFilter = props.expression.filters.labels[props.filterIdx];
  const values = Array.from((_props$labelValues$ge = props.labelValues.get(props.selectedLabel)) !== null && _props$labelValues$ge !== void 0 ? _props$labelValues$ge : []);
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    xs: 12,
    spacing: 1,
    alignItems: "flex-start"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: 'metric-input-' + props.filterIdx
  }, "Label"), /*#__PURE__*/React.createElement(FilterSelector, {
    id: 'metric-input-' + props.filterIdx,
    fullWidth: true,
    values: props.labelNames,
    defaultVal: "",
    onChange: ({
      target
    }) => {
      const filtersCopy = props.expression.filters.copy();
      filtersCopy.setIndex(props.filterIdx, target.value, '');
      props.onChange({ ...props.expression,
        filters: filtersCopy
      });
    },
    selectedValue: props.selectedLabel
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 2
  }, /*#__PURE__*/React.createElement(Grid, null, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: 'condition-input-' + props.filterIdx
  }, "Condition"), /*#__PURE__*/React.createElement(TextField, {
    id: 'condition-input-' + props.filterIdx,
    fullWidth: true,
    required: true,
    select: true,
    value: currentFilter.operator,
    onChange: ({
      target
    }) => {
      const filtersCopy = props.expression.filters.copy();
      const filterOperator = isRegexValue(target.value) ? '=~' : '=';
      filtersCopy.setIndex(props.filterIdx, currentFilter.name, currentFilter.value, filterOperator);
      props.onChange({ ...props.expression,
        filters: filtersCopy
      });
    }
  }, LABEL_OPERATORS.map(item => /*#__PURE__*/React.createElement(MenuItem, {
    key: item,
    value: item
  }, item))))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 3
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: 'value-input-' + props.filterIdx
  }, "Value"), /*#__PURE__*/React.createElement(Autocomplete, {
    value: currentFilter.value,
    freeSolo: true,
    options: values,
    onChange: (_e, value) => {
      const filtersCopy = props.expression.filters.copy();
      filtersCopy.setIndex(props.filterIdx, currentFilter.name, value, currentFilter.operator);
      props.onChange({ ...props.expression,
        filters: filtersCopy
      });
    },
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      required: true,
      id: 'value-input-' + props.filterIdx
    }))
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1,
    container: true,
    alignItems: "center",
    justify: "flex-end"
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: () => props.onRemove(props.filterIdx),
    edge: "end"
  }, /*#__PURE__*/React.createElement(RemoveCircleIcon, null))));
}

function FilterSelector(props) {
  const classes = useStyles();
  const menuItems = props.values.map(val => /*#__PURE__*/React.createElement(MenuItem, {
    value: val,
    key: val
  }, val));
  return /*#__PURE__*/React.createElement(Select, {
    fullWidth: true,
    disabled: props.disabled,
    displayEmpty: true,
    className: classes.metricFilterItem,
    value: props.selectedValue,
    onChange: props.onChange
  }, /*#__PURE__*/React.createElement(MenuItem, {
    disabled: true,
    value: ""
  }, props.defaultVal), menuItems);
} // Labels we don't want to show during metric filtering since they are useless


const forbiddenLabels = new Set(['networkID', '__name__']);

function getFilteredListOfLabelNames(labelNames) {
  return labelNames.filter(label => !forbiddenLabels.has(label));
} // Checks if a value has regex characters


function isRegexValue(value) {
  const regexChars = '.+*|?()[]{}:=';

  for (const char of regexChars.split('')) {
    if (value.includes(char)) {
      return true;
    }
  }

  return false;
}
/**
 * Gets the first word application prefix of a prometheus metric name. This
 * is known by most client libraries as a namespace.
 */


function getMetricNamespace(option) {
  const index = option.indexOf('_');

  if (index > -1) {
    return option.slice(0, index);
  }

  return option;
}