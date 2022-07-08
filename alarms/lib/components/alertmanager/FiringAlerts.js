import _get from "lodash/get";

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import AddAlertTwoToneIcon from '@material-ui/icons/AddAlertTwoTone';
import AlertDetailsPane from './AlertDetails/AlertDetailsPane';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import SimpleTable from '../table/SimpleTable';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { Link } from 'react-router-dom';
import { SEVERITY } from '../severity/Severity';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../AlarmContext';
import { useEffect, useState } from 'react';
import { useNetworkId } from '../../components/hooks';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(4)
  },
  loading: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addAlertIcon: {
    fontSize: '200px',
    margin: theme.spacing(1)
  },
  helperText: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.pxToRem(20)
  }
}));
export default function FiringAlerts(props) {
  const {
    match
  } = useRouter();
  const {
    apiUtil,
    filterLabels
  } = useAlarmContext();
  const [selectedRow, setSelectedRow] = useState(null);
  const [lastRefreshTime, _setLastRefreshTime] = useState(new Date().toLocaleString());
  const [alertData, setAlertData] = useState(null);
  const classes = useStyles();
  const snackbars = useSnackbars();
  const networkId = useNetworkId();
  const {
    error,
    isLoading,
    response
  } = apiUtil.useAlarmsApi(apiUtil.viewFiringAlerts, {
    networkId
  }, lastRefreshTime);
  useEffect(() => {
    if (!isLoading) {
      const alertData = response ? response.map(alert => {
        let labels = alert.labels;

        if (labels && filterLabels) {
          labels = filterLabels(labels);
        }

        return { ...alert,
          labels
        };
      }) : [];
      setAlertData(alertData);
    }

    return () => {
      setAlertData(null);
    };
  }, [filterLabels, isLoading, response, setAlertData]);
  const showRowDetailsPane = React.useCallback(row => {
    setSelectedRow(row);
  }, [setSelectedRow]);
  const hideDetailsPane = React.useCallback(() => {
    setSelectedRow(null);
  }, [setSelectedRow]);
  React.useEffect(() => {
    if (error) {
      snackbars.error(`Unable to load firing alerts. ${error.response ? error.response.data.message : error.message || ''}`);
    }
  }, [error, snackbars]);

  if (!isLoading && (alertData === null || alertData === void 0 ? void 0 : alertData.length) === 0) {
    var _props$emptyAlerts;

    return /*#__PURE__*/React.createElement(Grid, {
      container: true,
      spacing: 2,
      direction: "column",
      alignItems: "center",
      justify: "center",
      "data-testid": "no-alerts-icon",
      style: {
        minHeight: '60vh'
      }
    }, !((_props$emptyAlerts = props.emptyAlerts) !== null && _props$emptyAlerts !== void 0 ? _props$emptyAlerts : false) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(AddAlertTwoToneIcon, {
      color: "primary",
      className: classes.addAlertIcon
    })), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement("span", {
      className: classes.helperText
    }, "Start creating alert rules")), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, /*#__PURE__*/React.createElement(Button, {
      color: "primary",
      size: "small",
      variant: "contained",
      component: Link,
      to: `${match.url.slice(0, match.url.lastIndexOf('/'))}/rules`
    }, "Add Alert Rule"))) : /*#__PURE__*/React.createElement(React.Fragment, null, props.emptyAlerts));
  }

  return /*#__PURE__*/React.createElement(Grid, {
    className: classes.root,
    container: true,
    spacing: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: selectedRow ? 8 : 12
  }, /*#__PURE__*/React.createElement(SimpleTable, {
    onRowClick: showRowDetailsPane,
    columnStruct: [{
      title: 'name',
      getValue: x => {
        var _x$labels;

        return (_x$labels = x.labels) === null || _x$labels === void 0 ? void 0 : _x$labels.alertname;
      },
      renderFunc: data => {
        var _data$labels;

        const entity = data.labels.entity || data.labels.nodeMac || null;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
          variant: "body1"
        }, (_data$labels = data.labels) === null || _data$labels === void 0 ? void 0 : _data$labels.alertname), entity && /*#__PURE__*/React.createElement(Typography, {
          variant: "body2"
        }, entity));
      }
    }, {
      title: 'severity',
      getValue: x => {
        var _x$labels2;

        return (_x$labels2 = x.labels) === null || _x$labels2 === void 0 ? void 0 : _x$labels2.severity;
      },
      render: 'severity'
    }, {
      title: 'date',
      getValue: x => x.startsAt,
      renderFunc: (data, classes) => {
        const date = moment(new Date(data.startsAt));
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
          variant: "body1"
        }, date.fromNow()), /*#__PURE__*/React.createElement("div", {
          className: classes.secondaryItalicCell
        }, date.format('dddd, MMMM Do YYYY')));
      }
    }],
    tableData: alertData || [],
    sortFunc: alert => _get(SEVERITY, [_get(alert, ['labels', 'severity']).toLowerCase(), 'index'], undefined),
    "data-testid": "firing-alerts"
  }), isLoading && /*#__PURE__*/React.createElement("div", {
    className: classes.loading
  }, /*#__PURE__*/React.createElement(CircularProgress, null))), /*#__PURE__*/React.createElement(Slide, {
    direction: "left",
    in: !!selectedRow
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 4
  }, selectedRow && /*#__PURE__*/React.createElement(AlertDetailsPane, {
    alert: selectedRow,
    onClose: hideDetailsPane
  }))));
}