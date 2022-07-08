/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 *
 */
import * as React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { ObjectViewer } from './AlertDetailsPane';
import { useAlarmContext } from '../../AlarmContext';
export default function MetricAlertViewer({
  alert
}) {
  const {
    filterLabels
  } = useAlarmContext();
  const {
    labels,
    annotations
  } = alert || {};
  const {
    alertname: _a,
    severity: _s,
    ...extraLabels
  } = labels || {};
  const {
    description,
    ...extraAnnotations
  } = annotations || {};
  const [showDetails, setShowDetails] = React.useState(false);
  return /*#__PURE__*/React.createElement(Grid, {
    container: true,
    "data-testid": "metric-alert-viewer",
    spacing: 5
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, description)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(ObjectViewer, {
    object: filterLabels ? filterLabels(extraLabels) : extraLabels
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(Link, {
    variant: "subtitle1",
    component: "button",
    onClick: () => setShowDetails(!showDetails)
  }, 'Show More Details')), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Collapse, {
    in: showDetails
  }, /*#__PURE__*/React.createElement(ObjectViewer, {
    object: extraAnnotations
  }))));
}