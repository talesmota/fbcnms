/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import React from 'react';
export function mockPrometheusRule(merge) {
  return {
    name: '<<test>>',
    severity: 'info',
    description: '<<test description>>',
    expression: 'up == 0',
    period: '1m',
    ruleType: 'prometheus',
    rawRule: {
      alert: '<<test>>',
      labels: {
        severity: 'info'
      },
      expr: 'up == 0',
      for: '1m'
    },
    ...(merge || {})
  };
}
export function mockAlert(merge) {
  const {
    labels,
    annotations,
    ...otherFields
  } = merge || {};
  const defaultLabels = {
    alertname: 'test',
    severity: 'NOTICE'
  };
  const defaultAnnotations = {
    description: 'test description'
  };
  return {
    startsAt: '2020-02-10T21:09:12Z',
    endsAt: '',
    fingerprint: '',
    receivers: [],
    status: {
      inhibitedBy: [],
      silencedBy: [],
      state: ''
    },
    labels: { ...defaultLabels,
      ...(labels || {})
    },
    annotations: { ...defaultAnnotations,
      ...(annotations || {})
    },
    ...otherFields
  };
}
export function mockRuleInterface(overrides) {
  const {
    friendlyName,
    AlertViewer,
    RuleEditor,
    RuleViewer,
    deleteRule,
    getRules
  } = overrides || {};
  return {
    friendlyName: friendlyName !== null && friendlyName !== void 0 ? friendlyName : 'mock rule',
    RuleEditor: RuleEditor !== null && RuleEditor !== void 0 ? RuleEditor : function (_props) {
      return /*#__PURE__*/React.createElement("span", null);
    },
    RuleViewer: RuleViewer !== null && RuleViewer !== void 0 ? RuleViewer : function (_props) {
      return /*#__PURE__*/React.createElement("span", null);
    },
    AlertViewer: AlertViewer !== null && AlertViewer !== void 0 ? AlertViewer : function (_props) {
      return /*#__PURE__*/React.createElement("span", null);
    },
    deleteRule: deleteRule !== null && deleteRule !== void 0 ? deleteRule : jest.fn(() => Promise.resolve()),
    getRules: getRules !== null && getRules !== void 0 ? getRules : jest.fn(() => Promise.resolve([]))
  };
}