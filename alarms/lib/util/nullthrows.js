/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
class NullValueError extends Error {
  constructor(message) {
    super('[NullValueError]' + (message ? ' ' + message : ''));
  }

}

export default function nullthrows(data, message) {
  if (data == null) {
    throw new NullValueError(message);
  }

  return data;
}