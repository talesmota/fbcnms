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
import React from 'react';
import { PROMETHEUS_RULE_TYPE } from './rules/PrometheusEditor/getRuleInterface';
const emptyApiUtil = {
  useAlarmsApi: () => ({
    response: null,
    error: new Error('not implemented'),
    isLoading: false
  }),
  viewFiringAlerts: (..._) => Promise.reject('not implemented'),
  getTroubleshootingLink: (..._) => Promise.reject('not implemented'),
  viewMatchingAlerts: (..._) => Promise.reject('not implemented'),
  createAlertRule: (..._) => Promise.reject('not implemented'),
  editAlertRule: (..._) => Promise.reject('not implemented'),
  getAlertRules: (..._) => Promise.reject('not implemented'),
  deleteAlertRule: (..._) => Promise.reject('not implemented'),
  getSuppressions: (..._) => Promise.reject('not implemented'),
  createReceiver: (..._) => Promise.reject('not implemented'),
  editReceiver: (..._) => Promise.reject('not implemented'),
  getReceivers: (..._) => Promise.reject('not implemented'),
  deleteReceiver: (..._) => Promise.reject('not implemented'),
  getRouteTree: (..._) => Promise.reject('not implemented'),
  editRouteTree: (..._) => Promise.reject('not implemented'),
  getMetricNames: (..._) => Promise.reject('not implemented'),
  getMetricSeries: (..._) => Promise.reject('not implemented'),
  getGlobalConfig: _ => Promise.reject('not implemented'),
  editGlobalConfig: _ => Promise.reject('not implemented'),
  getTenants: _ => Promise.reject('not implemented'),
  getAlertmanagerTenancy: _ => Promise.reject('not implemented'),
  getPrometheusTenancy: _ => Promise.reject('not implemented')
};
const context = /*#__PURE__*/React.createContext({
  apiUtil: emptyApiUtil,
  filterLabels: x => x,
  ruleMap: {},
  getAlertType: _ => PROMETHEUS_RULE_TYPE,
  thresholdEditorEnabled: false,
  alertManagerGlobalConfigEnabled: false
});
export function useAlarmContext() {
  return React.useContext(context);
}
export default context;