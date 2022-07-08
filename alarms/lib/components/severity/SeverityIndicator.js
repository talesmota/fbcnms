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
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { SEVERITY } from './Severity';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  // the circle
  indicator: {
    display: 'inline-block',
    height: '10px',
    width: '10px',
    borderRadius: '50%'
  },
  chip: {
    color: 'white',
    textTransform: 'capitalize',
    padding: '5px',
    fontWeight: 600,
    marginBottom: '20px'
  },
  text: {
    marginLeft: theme.spacing(1),
    textTransform: 'capitalize'
  },
  critical: {
    backgroundColor: SEVERITY.CRITICAL.color
  },
  major: {
    backgroundColor: SEVERITY.MAJOR.color
  },
  minor: {
    backgroundColor: SEVERITY.MINOR.color
  },
  warning: {
    backgroundColor: SEVERITY.WARNING.color
  },
  info: {
    backgroundColor: SEVERITY.INFO.color
  },
  notice: {
    backgroundColor: SEVERITY.NOTICE.color
  },
  unknown: {
    backgroundColor: SEVERITY.NOTICE.color
  }
}));
export default function SeverityIndicator(props) {
  var _props$chip;

  const severity = props.severity;
  const value = severity && severity.trim() !== '' ? severity.toLowerCase() : 'unknown';
  const classes = useStyles();
  const colorClassname = React.useMemo(() => {
    var _classes$value;

    return classnames(classes.indicator, (_classes$value = classes[value]) !== null && _classes$value !== void 0 ? _classes$value : classes.unknown);
  }, [value, classes]);
  const colorChipClassname = React.useMemo(() => {
    var _classes$value2;

    return classnames(classes.chip, (_classes$value2 = classes[value]) !== null && _classes$value2 !== void 0 ? _classes$value2 : classes.unknown);
  }, [value, classes]);
  const chip = (_props$chip = props.chip) !== null && _props$chip !== void 0 ? _props$chip : false;
  return /*#__PURE__*/React.createElement(React.Fragment, null, !chip ? /*#__PURE__*/React.createElement(Typography, {
    noWrap: true
  }, /*#__PURE__*/React.createElement("span", {
    className: colorClassname
  }), /*#__PURE__*/React.createElement("span", {
    className: classes.text
  }, value)) : /*#__PURE__*/React.createElement(Chip, {
    label: value,
    className: colorChipClassname
  }));
}