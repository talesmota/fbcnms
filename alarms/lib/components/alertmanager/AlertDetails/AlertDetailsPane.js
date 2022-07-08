/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 *
 * Base container for showing details of different types of alerts. To show
 * a custom component for an alert type, 2 interfaces must be implemented:
 *  Implement the getAlertType in AlarmContext. This function should
 *  inspect the labels/annotations of an alert and determine which rule type
 *  generated it.
 *
 *  Implement the AlertViewer interface for the rule type. By default, the
 *  MetricAlertViewer will be shown.
 */
import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MetricAlertViewer from './MetricAlertViewer';
import Paper from '@material-ui/core/Paper';
import SeverityIndicator from '../../severity/SeverityIndicator';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../../AlarmContext';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  // annotations can potentially contain json so it should wrap properly
  objectViewerValue: {
    wordBreak: 'break-word'
  },
  objectViewerItem: {
    marginBottom: '0',
    justifyContent: 'space-between'
  }
}));
export default function AlertDetailsPane({
  alert,
  onClose
}) {
  const classes = useStyles();
  const {
    getAlertType,
    ruleMap
  } = useAlarmContext();
  const alertType = getAlertType ? getAlertType(alert) : '';
  const {
    startsAt,
    labels
  } = alert || {};
  const {
    alertname,
    severity
  } = labels || {};
  const AlertViewer = getAlertViewer(ruleMap, alertType);
  return /*#__PURE__*/React.createElement(Paper, {
    elevation: 1,
    "data-testid": "alert-details-pane"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 2,
    className: classes.root
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    spacing: 1
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    justify: "space-between"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(SeverityIndicator, {
    severity: severity,
    chip: true
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(IconButton, {
    size: "small",
    edge: "end",
    onClick: onClose,
    "data-testid": "alert-details-close"
  }, /*#__PURE__*/React.createElement(CloseIcon, null)))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5"
  }, alertname)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(AlertDate, {
    date: startsAt
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(AlertViewer, {
    alert: alert
  }))), /*#__PURE__*/React.createElement(AlertTroubleshootingLink, {
    alertName: alertname
  }));
}
/**
 * Get the AlertViewer for this alert's rule type or fallback to the default.
 */

function getAlertViewer(ruleMap, alertType) {
  const ruleInterface = ruleMap[alertType];

  if (!(ruleInterface && ruleInterface.AlertViewer)) {
    return MetricAlertViewer;
  }

  return ruleInterface.AlertViewer;
}

function AlertDate({
  date
}) {
  const classes = useStyles();
  const fromNow = React.useMemo(() => moment(date).local().fromNow(), [date]);
  const startDate = React.useMemo(() => moment(date).local().format('MMM Do YYYY, h:mm:ss a'), [date]);
  return /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary"
  }, /*#__PURE__*/React.createElement("span", {
    className: classes.capitalize
  }, fromNow), " | ", startDate);
}
/**
 * Link to troubleshooting documentation or display nothing if no link provided
 */


function AlertTroubleshootingLink({
  alertName
}) {
  const classes = useStyles();
  const snackbars = useSnackbars();
  const {
    apiUtil
  } = useAlarmContext();
  const {
    error,
    response: troubleshootingLink
  } = apiUtil.useAlarmsApi(apiUtil.getTroubleshootingLink, {
    alertName
  });
  React.useEffect(() => {
    if (error) {
      snackbars.error(`Unable to load troubleshooting link. ${error.response ? error.response.data.message : error.message || ''}`);
    }
  }, [error, snackbars]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, ((troubleshootingLink === null || troubleshootingLink === void 0 ? void 0 : troubleshootingLink.link) || '').length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    variant: "fullWidth"
  }), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 2,
    className: classes.root
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Link, {
    variant: "subtitle1",
    href: troubleshootingLink === null || troubleshootingLink === void 0 ? void 0 : troubleshootingLink.link,
    target: "_blank",
    rel: "noopener"
  }, troubleshootingLink === null || troubleshootingLink === void 0 ? void 0 : troubleshootingLink.title)))));
}
/**
 * Shows the key-value pairs of an object such as annotations or labels.
 */


export function ObjectViewer({
  object
}) {
  const labelKeys = Object.keys(object);
  const classes = useStyles();
  return /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true
  }, labelKeys.length < 1 && /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    color: "textSecondary"
  }, "None")), labelKeys.map(key => /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    spacing: 4,
    className: classes.objectViewerItem
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "subtitle1"
  }, key, ":")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    className: classes.objectViewerValue,
    color: "textSecondary",
    variant: "subtitle1"
  }, object[key])))));
}
export function Section({
  title,
  children,
  divider
}) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    spacing: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5"
  }, title)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    spacing: 2
  }, children), divider !== false && /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Divider, null)));
}
const useDetailIconStyles = makeStyles(_theme => ({
  root: {
    verticalAlign: 'middle',
    fontSize: '1rem'
  }
})); // layout for items in the Details section

export function Detail({
  icon: Icon,
  title,
  children
}) {
  const iconStyles = useDetailIconStyles();
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    wrap: "nowrap",
    spacing: 1
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Icon, {
    classes: iconStyles,
    fontSize: "small"
  })), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    item: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, title)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    color: "textSecondary"
  }, children))));
}