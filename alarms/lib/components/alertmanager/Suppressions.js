/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import SimpleTable, { toLabels } from '../table/SimpleTable';
import TableActionDialog from '../table/TableActionDialog';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../AlarmContext';
import { useNetworkId } from '../../components/hooks';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
import { useState } from 'react';
const useStyles = makeStyles(theme => ({
  addButton: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: theme.spacing(2)
  },
  loading: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
export default function Suppressions() {
  const {
    apiUtil
  } = useAlarmContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [lastRefreshTime, _setLastRefreshTime] = useState(new Date().toLocaleString());
  const [_isAddEditAlert, _setIsAddEditAlert] = useState(false);
  const classes = useStyles();
  const snackbars = useSnackbars();
  const networkId = useNetworkId();
  const {
    isLoading,
    error,
    response
  } = apiUtil.useAlarmsApi(apiUtil.getSuppressions, {
    networkId
  }, lastRefreshTime);

  if (error) {
    snackbars.error(`Unable to load suppressions: ${error.response ? error.response.data.message : error.message}`);
  }

  const silencesList = response || [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SimpleTable, {
    tableData: silencesList,
    onActionsClick: (alert, target) => {
      setMenuAnchorEl(target);
      setCurrentRow(alert);
    },
    columnStruct: [{
      title: 'name',
      getValue: row => row.comment || ''
    }, {
      title: 'active',
      getValue: row => {
        var _row$status$state, _row$status;

        return (_row$status$state = (_row$status = row.status) === null || _row$status === void 0 ? void 0 : _row$status.state) !== null && _row$status$state !== void 0 ? _row$status$state : '';
      }
    }, {
      title: 'created by',
      getValue: row => row.createdBy
    }, {
      title: 'matchers',
      getValue: row => row.matchers ? row.matchers.map(matcher => toLabels(matcher)) : [],
      render: 'multipleGroups'
    }]
  }), isLoading && silencesList.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: classes.loading
  }, /*#__PURE__*/React.createElement(CircularProgress, null)), /*#__PURE__*/React.createElement(Menu, {
    anchorEl: menuAnchorEl,
    keepMounted: true,
    open: Boolean(menuAnchorEl),
    onClose: () => setMenuAnchorEl(null)
  }, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: () => setShowDialog(true)
  }, "View")), /*#__PURE__*/React.createElement(TableActionDialog, {
    open: showDialog,
    onClose: () => setShowDialog(false),
    title: 'View Suppression',
    row: currentRow || {},
    showCopyButton: true,
    showDeleteButton: false
  }));
}