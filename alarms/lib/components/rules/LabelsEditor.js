/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 *
 * Edit rule labels
 */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
const filteredLabels = new Set(['networkID', 'severity']);
export default function LabelsEditor({
  labels,
  onChange
}) {
  /**
   * Use an array instead of an object because editing an object's key is not
   * possible in this context without causing weird issues.
   */
  const [labelsState, setLabelsState] = React.useState(convertLabelsToPairs(labels, filteredLabels)); // use this instead of using setLabelsState directly

  const updateLabels = React.useCallback(newLabelsState => {
    setLabelsState(newLabelsState);
    const newLabels = convertPairsToLabels(newLabelsState);
    onChange(newLabels);
  }, [onChange, setLabelsState]); // update a single label by index

  const updateLabel = React.useCallback((index, key, value) => {
    const labelsStateCopy = [...labelsState];
    const newLabel = [key, value];

    if (labelsStateCopy[index]) {
      // edit existing label
      labelsStateCopy[index] = newLabel;
    } else {
      console.error(`no label found at index: ${index}`);
    }

    updateLabels(labelsStateCopy);
  }, [labelsState, updateLabels]);
  const handleKeyChange = React.useCallback((index, newKey) => {
    updateLabel(index, newKey, labelsState[index][1]);
  }, [labelsState, updateLabel]);
  const handleValueChange = React.useCallback((index, value) => {
    updateLabel(index, labelsState[index][0], value);
  }, [labelsState, updateLabel]);
  const addNewLabel = React.useCallback(() => {
    updateLabels(labelsState.concat([['', '']]));
  }, [updateLabels, labelsState]);
  const removeLabel = React.useCallback(index => {
    updateLabels([...labelsState.slice(0, index - 1), ...labelsState.slice(index + 1, labelsState.length)]);
  }, [labelsState, updateLabels]);
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
      variant: "h5",
      gutterBottom: true
    }, "Labels"), /*#__PURE__*/React.createElement(Typography, {
      color: "textSecondary",
      gutterBottom: true,
      variant: "body2"
    }, "Add labels to attach data to this alert"))
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 2
  }, labelsState && labelsState.map(([key, value], index) => /*#__PURE__*/React.createElement(Grid, {
    container: true,
    key: index,
    item: true,
    spacing: 1
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "label-name-input"
  }, "Label Name"), /*#__PURE__*/React.createElement(TextField, {
    id: "label-name-input",
    placeholder: "Name",
    value: key,
    fullWidth: true,
    onChange: e => handleKeyChange(index, e.target.value)
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 5
  }, /*#__PURE__*/React.createElement(InputLabel, {
    htmlFor: "label-value-input"
  }, "Value"), /*#__PURE__*/React.createElement(TextField, {
    id: "label-value-input",
    placeholder: "Value",
    value: value,
    fullWidth: true,
    onChange: e => handleValueChange(index, e.target.value)
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, /*#__PURE__*/React.createElement(IconButton, {
    title: "Remove Label",
    "aria-label": "Remove Label",
    onClick: () => removeLabel(index)
  }, /*#__PURE__*/React.createElement(DeleteIcon, null))))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    size: "small",
    onClick: addNewLabel,
    "data-testid": "add-new-label"
  }, "Add new label")))));
} // converts Labels to an array like [[key,value], [key,value]]

function convertLabelsToPairs(labels, filter) {
  return Object.keys(labels).filter(key => !filter.has(key)).map(key => [key, labels[key]]);
} // converts n array like [[key,value], [key,value]] to Labels


function convertPairsToLabels(pairs) {
  return pairs.reduce((map, [key, val]) => {
    if (key && key.trim() !== '') {
      map[key] = val;
    }

    return map;
  }, {});
}