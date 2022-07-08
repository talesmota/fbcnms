function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 * Standardized interface for dealing with material-ui's ref forwarding problem.
 * https://material-ui.com/guides/composition/#caveat-with-refs
 *
 * Summary:
 * Many MUI components, such as Tooltip and Slide need access to a raw DOM
 * element. The api has changed and now refs are required for this. If a custom
 * component is a child of these certain MUI components, it will need to accept
 * a ref from the MUI component and forward it down to the nearest DOM node.
 *
 * Example usage:
 *
 * <Tooltip>
 *  <CustomComponent />
 * </Tooltip>
 *
 *
 * const CustomComponent = withForwardRef(({ fwdRef }: ForwardRef) => {
 *   return <div ref={fwdRef}/>
 * })
 *
 * Notes:
 * Only the component which is a direct child of an MUI component *needs* to be
 * wrapped in withForwardRef. Children deeper in the tree *can* be wrapped in
 * withForwardRef
 */
import * as React from 'react';
export function withForwardRef(Component) {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    return /*#__PURE__*/React.createElement(Component, _extends({
      fwdRef: ref
    }, props));
  });
}