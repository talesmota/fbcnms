/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import * as PromQL from '../../../prometheus/PromQL';
import { thresholdToPromQL } from '../ToggleableExpressionEditor';
afterEach(() => {
  jest.resetAllMocks();
});
test('correctly converts a ThresholdExpression to PromQL', () => {
  const testCases = [{
    expression: {
      metricName: 'test',
      comparator: new PromQL.BinaryComparator('<'),
      filters: new PromQL.Labels(),
      value: 7
    },
    expectedPromQL: 'test < 7'
  }, {
    expression: {
      metricName: 'test',
      comparator: new PromQL.BinaryComparator('>'),
      filters: new PromQL.Labels().addEqual('label1', 'val1').addEqual('label2', 'val2'),
      value: 10
    },
    expectedPromQL: 'test{label1="val1",label2="val2"} > 10'
  }, {
    expression: {
      metricName: 'test',
      comparator: new PromQL.BinaryComparator('>'),
      filters: new PromQL.Labels().addRegex('label1', 'val1').addRegex('label2', 'val2'),
      value: 10
    },
    expectedPromQL: 'test{label1=~"val1",label2=~"val2"} > 10'
  }];
  testCases.forEach(test => {
    expect(thresholdToPromQL(test.expression)).toBe(test.expectedPromQL);
  });
});