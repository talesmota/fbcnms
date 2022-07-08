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
import AddEditReceiver from './AddEditReceiver';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GlobalConfig from './GlobalConfig';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import SimpleTable from '../../table/SimpleTable';
import TableActionDialog from '../../table/TableActionDialog';
import TableAddButton from '../../table/TableAddButton';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../../AlarmContext';
import { useNetworkId } from '../../../components/hooks';
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
  }
}));
export default function Receivers() {
  const {
    apiUtil,
    alertManagerGlobalConfigEnabled
  } = useAlarmContext();
  const [isAddEditReceiver, setIsAddEditReceiver] = React.useState(false);
  const [isEditGlobalSettings, setIsEditGlobalSettings] = React.useState(false);
  const [isNewReceiver, setIsNewReceiver] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const menuAnchorEl = React.useRef(null);
  const [lastRefreshTime, setLastRefreshTime] = React.useState(new Date().toLocaleString());
  const networkId = useNetworkId();
  const classes = useStyles();
  const snackbars = useSnackbars();
  const handleActionsMenuOpen = React.useCallback((row, eventTarget) => {
    setSelectedRow(row);
    menuAnchorEl.current = eventTarget;
    setIsMenuOpen(true);
  }, [menuAnchorEl, setIsMenuOpen, setSelectedRow]);
  const handleActionsMenuClose = React.useCallback(() => {
    setSelectedRow(null);
    menuAnchorEl.current = null;
    setIsMenuOpen(false);
  }, [menuAnchorEl, setIsMenuOpen, setSelectedRow]);
  const handleEdit = React.useCallback(() => {
    setIsAddEditReceiver(true);
    setIsNewReceiver(false);
    setIsMenuOpen(false);
  }, [setIsAddEditReceiver, setIsNewReceiver]);
  const handleDelete = React.useCallback(() => {
    async function makeRequest() {
      try {
        if (selectedRow) {
          await apiUtil.deleteReceiver({
            networkId,
            receiverName: selectedRow.name
          });
          snackbars.success(`Successfully deleted receiver`);
          setIsMenuOpen(false);
        }
      } catch (error) {
        var _error$response, _error$response$data;

        snackbars.error(`Unable to delete receiver: ${error.response ? (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message : error.message}. Please try again.`);
      } finally {
        setLastRefreshTime(new Date().toLocaleString());
      }
    }

    makeRequest();
  }, [apiUtil, networkId, selectedRow, snackbars]);
  const handleViewDialogOpen = React.useCallback(() => {
    setIsDialogOpen(true);
    setIsMenuOpen(false);
  }, [setIsDialogOpen]);
  const handleViewDialogClose = React.useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);
  const {
    isLoading,
    error,
    response
  } = apiUtil.useAlarmsApi(apiUtil.getReceivers, {
    networkId
  }, lastRefreshTime);

  if (error) {
    snackbars.error(`Unable to load receivers: ${error.response ? error.response.data.message : error.message}`);
  }

  const receiversData = response || [];

  if (isAddEditReceiver) {
    return /*#__PURE__*/React.createElement(AddEditReceiver, {
      receiver: selectedRow || newReceiver(),
      isNew: isNewReceiver,
      onExit: () => {
        setIsAddEditReceiver(false);
        setLastRefreshTime(new Date().toLocaleString());
      }
    });
  }

  if (isEditGlobalSettings) {
    return /*#__PURE__*/React.createElement(GlobalConfig, {
      onExit: () => {
        setIsEditGlobalSettings(false);
        setLastRefreshTime(new Date().toLocaleString());
      }
    });
  }

  return /*#__PURE__*/React.createElement(Grid, {
    className: classes.root,
    container: true,
    spacing: 2,
    direction: "column"
  }, alertManagerGlobalConfigEnabled === true && /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsEditGlobalSettings(true),
    startIcon: /*#__PURE__*/React.createElement(SettingsIcon, null),
    variant: "outlined"
  }, "Settings")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(SimpleTable, {
    tableData: receiversData,
    onActionsClick: handleActionsMenuOpen,
    columnStruct: [{
      title: 'name',
      getValue: row => row.name
    }, {
      title: 'notifications',
      render: 'labels',
      getValue: getNotificationsSummary
    }]
  })), isLoading && receiversData.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: classes.loading
  }, /*#__PURE__*/React.createElement(CircularProgress, null)), /*#__PURE__*/React.createElement(Menu, {
    anchorEl: menuAnchorEl.current,
    keepMounted: true,
    open: isMenuOpen,
    onClose: handleActionsMenuClose
  }, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleViewDialogOpen
  }, "View"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleEdit
  }, "Edit"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleDelete
  }, "Delete")), /*#__PURE__*/React.createElement(TableActionDialog, {
    open: isDialogOpen,
    onClose: handleViewDialogClose,
    title: 'View Receiver',
    row: selectedRow || {},
    showCopyButton: true,
    showDeleteButton: false
  }), /*#__PURE__*/React.createElement(TableAddButton, {
    label: "Add Receiver",
    onClick: () => {
      setIsNewReceiver(true);
      setIsAddEditReceiver(true);
      setSelectedRow(null);
      setIsMenuOpen(false);
    },
    "data-testid": "add-receiver-button"
  }));
}

function newReceiver() {
  return {
    name: ''
  };
}

function getNotificationsSummary(receiver) {
  const summary = {};
  const {
    slack_configs,
    email_configs,
    webhook_configs,
    pagerduty_configs,
    pushover_configs
  } = receiver;

  if (slack_configs) {
    const channelNames = slack_configs.reduce((list, {
      channel
    }) => {
      if (channel != null && channel.trim() !== '') {
        list.push(channel.replace(/#/, ''));
      }

      return list;
    }, []);

    if (channelNames.length > 0) {
      summary['Slack Channels'] = channelNames.join(', ');
    } else {
      const configCount = slack_configs.length;
      summary['Slack'] = `${configCount} channel${configCount > 1 ? 's' : ''}`;
    }
  }

  if (email_configs) {
    const emailAddresses = email_configs.map(({
      to
    }) => to);
    summary['Emails'] = emailAddresses.join(', ');
  }

  if (webhook_configs) {
    const webhookUrls = webhook_configs.map(({
      url
    }) => {
      try {
        const parsed = new URL(url);
        const trimmedLength = 24;
        const hostAndPath = `${parsed.host}${parsed.pathname}`;
        return hostAndPath.length > trimmedLength ? `${hostAndPath.substring(0, trimmedLength)}...` : hostAndPath;
      } catch (e) {
        console.error(e);
        return url.slice(0, 8);
      }
    });
    summary['Webhook'] = webhookUrls.join(', ');
  }

  if (pagerduty_configs) {
    summary['PagerDuty'] = pagerduty_configs.map(conf => conf.severity).join(',').slice(0, 12);
  }

  if (pushover_configs) {
    summary['Pushover'] = pushover_configs.map(conf => conf.title || '').join(', ').slice(0, 12);
  }

  return summary;
}