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
import AddEditRule from './rules/AddEditRule';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SimpleTable from './table/SimpleTable';
import TableActionDialog from './table/TableActionDialog';
import TableAddButton from './table/TableAddButton';
import axios from 'axios';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { Parse } from './prometheus/PromQLParser';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from './AlarmContext';
import { useLoadRules } from './hooks';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(4)
  },
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
  },
  helpButton: {
    color: 'black'
  }
}));
const PROMETHEUS_RULE_TYPE = 'prometheus';
export default function AlertRules() {
  const {
    apiUtil,
    ruleMap
  } = useAlarmContext();
  const snackbars = useSnackbars();
  const classes = useStyles();
  const {
    match
  } = useRouter();
  const [lastRefreshTime, setLastRefreshTime] = React.useState(new Date().getTime().toString());
  const menuAnchorEl = React.useRef(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [isNewAlert, setIsNewAlert] = React.useState(false);
  const [isAddEditAlert, setIsAddEditAlert] = React.useState(false);
  const [isViewAlertModalOpen, setIsViewAlertModalOpen] = React.useState(false);
  const [matchingAlertsCount, setMatchingAlertsCount] = React.useState(null);
  const {
    rules,
    isLoading
  } = useLoadRules({
    ruleMap,
    lastRefreshTime
  });
  const columnStruct = React.useMemo(() => [{
    title: 'name',
    getValue: x => x.name
  }, {
    title: 'severity',
    getValue: rule => rule.severity,
    render: 'severity'
  }, {
    title: 'fire alert when',
    getValue: rule => {
      try {
        const exp = Parse(rule.expression);

        if (exp) {
          var _exp$lh$selectorName, _exp$operator, _exp$rh$value;

          const metricName = ((_exp$lh$selectorName = exp.lh.selectorName) === null || _exp$lh$selectorName === void 0 ? void 0 : _exp$lh$selectorName.toUpperCase()) || '';
          const operator = ((_exp$operator = exp.operator) === null || _exp$operator === void 0 ? void 0 : _exp$operator.toString()) || '';
          const value = ((_exp$rh$value = exp.rh.value) === null || _exp$rh$value === void 0 ? void 0 : _exp$rh$value.toString()) || '';
          return `${metricName} ${operator} ${value} for ${rule.period}`;
        }
      } catch {}

      return 'error';
    }
  }, {
    title: 'description',
    getValue: rule => rule.description
  }], []);
  const handleActionsMenuOpen = React.useCallback((row, eventTarget) => {
    setSelectedRow(row);
    menuAnchorEl.current = eventTarget;
    setIsMenuOpen(true);
  }, [menuAnchorEl, setIsMenuOpen, setSelectedRow]);
  const loadMatchingAlerts = React.useCallback(async () => {
    try {
      // only show matching alerts for prometheus rules for now
      if (selectedRow && selectedRow.ruleType === PROMETHEUS_RULE_TYPE) {
        const response = await apiUtil.viewMatchingAlerts({
          networkId: match.params.networkId,
          expression: selectedRow.expression
        });
        setMatchingAlertsCount(response.length);
      }
    } catch (error) {
      snackbars.error('Could not load matching alerts for rule');
    }
  }, [selectedRow, apiUtil, match.params.networkId, snackbars]);
  const handleActionsMenuClose = React.useCallback(() => {
    setSelectedRow(null);
    menuAnchorEl.current = null;
    setIsMenuOpen(false);
  }, [menuAnchorEl, setIsMenuOpen, setSelectedRow]);
  const handleEdit = React.useCallback(() => {
    setIsAddEditAlert(true);
    setIsNewAlert(false);
  }, []);
  const handleView = React.useCallback(() => {
    loadMatchingAlerts();
    setIsViewAlertModalOpen(true);
  }, [loadMatchingAlerts]);
  const handleDelete = React.useCallback(async () => {
    try {
      if (selectedRow) {
        const cancelSource = axios.CancelToken.source();
        const {
          deleteRule
        } = ruleMap[selectedRow.ruleType];
        await deleteRule({
          networkId: match.params.networkId,
          ruleName: selectedRow.name,
          cancelToken: cancelSource.token
        });
        snackbars.success(`Successfully deleted alert rule`);
      }
    } catch (error) {
      var _error$response, _error$response$data;

      snackbars.error(`Unable to delete alert rule: ${error.response ? (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message : error.message}. Please try again.`);
    } finally {
      setLastRefreshTime(new Date().toLocaleString());
      setIsMenuOpen(false);
    }
  }, [match.params.networkId, ruleMap, selectedRow, snackbars]);
  const handleViewAlertModalClose = React.useCallback(() => {
    setIsViewAlertModalOpen(false);
    setMatchingAlertsCount(null);
  }, [setIsViewAlertModalOpen, setMatchingAlertsCount]);

  if (isAddEditAlert) {
    return /*#__PURE__*/React.createElement(AddEditRule, {
      initialConfig: selectedRow,
      isNew: isNewAlert,
      defaultRuleType: PROMETHEUS_RULE_TYPE,
      onExit: () => {
        setIsAddEditAlert(false);
        setLastRefreshTime(new Date().toLocaleString());
        handleActionsMenuClose();
      }
    });
  }

  return /*#__PURE__*/React.createElement(Grid, {
    className: classes.root
  }, /*#__PURE__*/React.createElement(SimpleTable, {
    columnStruct: columnStruct,
    tableData: rules || [],
    onActionsClick: handleActionsMenuOpen
  }), isLoading && /*#__PURE__*/React.createElement("div", {
    className: classes.loading
  }, /*#__PURE__*/React.createElement(CircularProgress, null)), /*#__PURE__*/React.createElement(Menu, {
    anchorEl: menuAnchorEl.current,
    open: isMenuOpen,
    onClose: handleActionsMenuClose
  }, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleEdit
  }, "Edit"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleView
  }, "View"), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: handleDelete
  }, "Delete")), selectedRow && /*#__PURE__*/React.createElement(TableActionDialog, {
    open: isViewAlertModalOpen,
    onClose: handleViewAlertModalClose,
    title: 'View Alert Rule',
    additionalContent: matchingAlertsCount !== null && /*#__PURE__*/React.createElement("span", null, "This rule matches ", /*#__PURE__*/React.createElement("strong", null, matchingAlertsCount), " active alarm(s)."),
    row: selectedRow.rawRule,
    showCopyButton: true,
    showDeleteButton: true,
    onDelete: () => {
      handleViewAlertModalClose();
      return handleDelete();
    },
    RowViewer: ruleMap && selectedRow ? ruleMap[selectedRow.ruleType].RuleViewer : undefined
  }), /*#__PURE__*/React.createElement(TableAddButton, {
    onClick: () => {
      setIsNewAlert(true);
      setSelectedRow(null);
      setIsAddEditAlert(true);
    },
    label: "Add Alert",
    "data-testid": "add-edit-alert-button"
  }));
}