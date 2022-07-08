/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import PrometheusEditor from './PrometheusEditor';
export const PROMETHEUS_RULE_TYPE = 'prometheus';
export default function getPrometheusRuleInterface({
  apiUtil
}) {
  return {
    [PROMETHEUS_RULE_TYPE]: {
      friendlyName: PROMETHEUS_RULE_TYPE,
      RuleEditor: PrometheusEditor,

      /**
       * Get alert rules from backend and map to generic
       */
      getRules: async req => {
        const rules = await apiUtil.getAlertRules(req);
        return rules.map(rule => {
          var _rule$annotations, _rule$labels;

          return {
            name: rule.alert,
            description: ((_rule$annotations = rule.annotations) === null || _rule$annotations === void 0 ? void 0 : _rule$annotations.description) || '',
            severity: ((_rule$labels = rule.labels) === null || _rule$labels === void 0 ? void 0 : _rule$labels.severity) || '',
            period: rule.for || '',
            expression: rule.expr,
            ruleType: PROMETHEUS_RULE_TYPE,
            rawRule: rule
          };
        });
      },
      deleteRule: params => apiUtil.deleteAlertRule(params)
    }
  };
}