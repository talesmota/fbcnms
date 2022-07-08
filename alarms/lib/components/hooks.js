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
import axios from 'axios';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { useAlarmContext } from '@fbcnms/alarms/components/AlarmContext';
import { useEnqueueSnackbar } from '@fbcnms/ui/hooks/useSnackbar';

/**
 * Loads alert rules for each rule type. Rules are loaded in parallel and if one
 * rule loader fails or exceeds the load timeout, it will be cancelled and a
 * snackbar will be enqueued.
 */
export function useLoadRules({
  ruleMap,
  lastRefreshTime
}) {
  const networkId = useNetworkId();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [isLoading, setIsLoading] = React.useState(true);
  const [rules, setRules] = React.useState([]);
  React.useEffect(() => {
    const promises = Object.keys(ruleMap || {}).map(ruleType => {
      const cancelSource = axios.CancelToken.source();
      const request = {
        networkId,
        cancelToken: cancelSource.token
      };
      const ruleInterface = ruleMap[ruleType];
      return new Promise(resolve => {
        ruleInterface.getRules(request).then(response => resolve(response)).catch(error => {
          console.error(error);
          enqueueSnackbar(`An error occurred while loading ${ruleInterface.friendlyName} rules`, {
            variant: 'error'
          });
          resolve([]);
        });
      });
    });
    Promise.all(promises).then(results => {
      const allResults = [].concat.apply([], results);
      setRules(allResults);
      setIsLoading(false);
    });
  }, [enqueueSnackbar, lastRefreshTime, networkId, ruleMap]);
  return {
    rules,
    isLoading
  };
}
/**
 * An alert rule can have a 1:N mapping from rule name to receivers. This
 * mapping is configured via the route tree. This hook loads the route tree
 * and returns all routes which contain a matcher for exactly this alertname.
 */

export function useAlertRuleReceiver({
  ruleName,
  apiUtil
}) {
  const networkId = useNetworkId();
  const {
    response
  } = apiUtil.useAlarmsApi(apiUtil.getRouteTree, {
    networkId
  }); // find all the routes which contain an alertname matcher for this alert

  const routesForAlertRule = React.useMemo(() => {
    if (!(response && response.routes)) {
      return [];
    } // only go one level deep for now


    const matchingRoutes = response.routes.filter(route => {
      return route.match && route.match['alertname'] && route.match['alertname'] === ruleName;
    });
    return matchingRoutes;
  }, [response, ruleName]);
  const [initialReceiver, setInitialReceiver] = React.useState();
  const [receiver, setReceiver] = React.useState();
  /**
   * once the routes are loaded, set the initial receiver so we can determine
   * if we need to add/remove/update routes
   */

  React.useEffect(() => {
    if (routesForAlertRule && routesForAlertRule.length > 0) {
      const _initialReceiver = routesForAlertRule[0].receiver;
      setInitialReceiver(_initialReceiver);
      setReceiver(_initialReceiver);
    }
  }, [routesForAlertRule]);
  const saveReceiver = React.useCallback(async () => {
    let updatedRoutes = response || {
      routes: [],
      receiver: `${networkId || 'tg'}_tenant_base_route`
    };

    if ((receiver == null || receiver.trim() === '') && initialReceiver != null) {
      // remove the route
      updatedRoutes = { ...updatedRoutes,
        routes: ((response === null || response === void 0 ? void 0 : response.routes) || []).filter(route => route.receiver !== initialReceiver)
      };
    } else if (receiver != null && initialReceiver == null) {
      // creating a new route
      const newRoute = {
        receiver: receiver,
        match: {
          alertname: ruleName
        }
      };
      updatedRoutes = { ...updatedRoutes,
        routes: [...((response === null || response === void 0 ? void 0 : response.routes) || []), newRoute]
      };
    } else {
      // update existing route
      updatedRoutes = { ...updatedRoutes,
        routes: ((response === null || response === void 0 ? void 0 : response.routes) || []).map(route => {
          if (route.receiver !== initialReceiver) {
            return route;
          }

          return { ...route,
            receiver: receiver || ''
          };
        })
      };
    }

    await apiUtil.editRouteTree({
      networkId: networkId,
      route: updatedRoutes
    });
  }, [receiver, initialReceiver, apiUtil, networkId, response, ruleName]);
  return {
    receiver,
    setReceiver,
    saveReceiver
  };
}
export function useNetworkId() {
  const {
    match
  } = useRouter();
  const {
    getNetworkId
  } = useAlarmContext();

  if (typeof getNetworkId === 'function') {
    return getNetworkId();
  }

  return match.params.networkId;
}