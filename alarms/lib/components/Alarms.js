/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AlarmContext from './AlarmContext';
import AlertRules from './AlertRules';
import FiringAlerts from './alertmanager/FiringAlerts';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import React from 'react';
import Receivers from './alertmanager/Receivers/Receivers';
import Routes from './alertmanager/Routes';
import Suppressions from './alertmanager/Suppressions';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import getPrometheusRuleInterface from './rules/PrometheusEditor/getRuleInterface';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { matchPath } from 'react-router';
const useTabStyles = makeStyles(theme => ({
  root: {
    minWidth: 'auto',
    minHeight: theme.spacing(4)
  },
  wrapper: {
    flexDirection: 'row',
    textTransform: 'capitalize',
    '& svg, .material-icons': {
      marginRight: theme.spacing(1)
    }
  }
}));
const TABS = {
  alerts: {
    name: 'Alerts',
    icon: /*#__PURE__*/React.createElement(NotificationsActiveIcon, null)
  },
  rules: {
    name: 'Rules',
    icon: /*#__PURE__*/React.createElement(AccountTreeIcon, null)
  },
  suppressions: {
    name: 'Suppressions',
    icon: /*#__PURE__*/React.createElement(React.Fragment, null)
  },
  routes: {
    name: 'Routes',
    icon: /*#__PURE__*/React.createElement(React.Fragment, null)
  },
  teams: {
    name: 'Teams',
    icon: /*#__PURE__*/React.createElement(GroupIcon, null)
  }
};
const DEFAULT_TAB_NAME = 'alerts';
export default function Alarms(props) {
  var _currentTabMatch$para;

  const {
    apiUtil,
    filterLabels,
    makeTabLink,
    getNetworkId,
    disabledTabs,
    thresholdEditorEnabled,
    alertManagerGlobalConfigEnabled,
    ruleMap,
    getAlertType,
    emptyAlerts
  } = props;
  const tabStyles = useTabStyles();
  const {
    match,
    location
  } = useRouter();
  const currentTabMatch = matchPath(location.pathname, {
    path: `${match.path}/:tabName`
  });
  const mergedRuleMap = useMergedRuleMap({
    ruleMap,
    apiUtil
  });
  const disabledTabSet = React.useMemo(() => {
    return new Set(disabledTabs !== null && disabledTabs !== void 0 ? disabledTabs : []);
  }, [disabledTabs]);
  return /*#__PURE__*/React.createElement(AlarmContext.Provider, {
    value: {
      apiUtil,
      thresholdEditorEnabled,
      alertManagerGlobalConfigEnabled,
      filterLabels,
      getNetworkId,
      ruleMap: mergedRuleMap,
      getAlertType: getAlertType
    }
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    spacing: 2,
    justify: "space-between"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: (currentTabMatch === null || currentTabMatch === void 0 ? void 0 : (_currentTabMatch$para = currentTabMatch.params) === null || _currentTabMatch$para === void 0 ? void 0 : _currentTabMatch$para.tabName) || DEFAULT_TAB_NAME,
    indicatorColor: "primary",
    textColor: "primary"
  }, Object.keys(TABS).map(keyName => {
    if (disabledTabSet.has(keyName)) {
      return null;
    }

    const {
      icon,
      name
    } = TABS[keyName];
    return /*#__PURE__*/React.createElement(Tab, {
      classes: tabStyles,
      component: Link,
      to: makeTabLink({
        keyName,
        match
      }),
      key: keyName,
      icon: icon,
      label: name,
      value: keyName
    });
  })))), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: `${match.path}/alerts`,
    render: () => /*#__PURE__*/React.createElement(FiringAlerts, {
      emptyAlerts: emptyAlerts,
      filterLabels: filterLabels
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: `${match.path}/rules`,
    render: () => /*#__PURE__*/React.createElement(AlertRules, {
      ruleMap: ruleMap,
      thresholdEditorEnabled: thresholdEditorEnabled
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: `${match.path}/suppressions`,
    render: () => /*#__PURE__*/React.createElement(Suppressions, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: `${match.path}/routes`,
    render: () => /*#__PURE__*/React.createElement(Routes, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: `${match.path}/teams`,
    render: () => /*#__PURE__*/React.createElement(Receivers, null)
  }), /*#__PURE__*/React.createElement(Redirect, {
    to: `${match.path}/${DEFAULT_TAB_NAME}`
  })));
} // merge custom ruleMap with default prometheus rule map

function useMergedRuleMap({
  ruleMap,
  apiUtil
}) {
  const mergedRuleMap = React.useMemo(() => Object.assign({}, getPrometheusRuleInterface({
    apiUtil: apiUtil
  }), ruleMap || {}), [ruleMap, apiUtil]);
  return mergedRuleMap;
}