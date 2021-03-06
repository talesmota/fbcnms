/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
export function assertType(value, shouldBe) {
  if (value instanceof shouldBe) {
    return value;
  } // $FlowFixMe: shouldBe.name does exist


  throw new Error('value is not of type ' + shouldBe.name);
}