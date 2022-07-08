function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
const COPIED_MESSAGE = 'Copied to clipboard!';
/* Wrap a button with this component to copy a string to clipboard when
 * the button is clicked. After the button is clicked, a tooltip will
 * pop up saying the copying was successful. Tooltip custom props can be
 * passed into this component directly.
 */

export default function ClipboardLink({
  title,
  ...props
}) {
  if (title != null) {
    return /*#__PURE__*/React.createElement(ClipboardLinkWithTitle, _extends({}, props, {
      title: title
    }));
  }

  return /*#__PURE__*/React.createElement(ClipboardLinkNoTitle, props);
}
/* Since the logic and states are diffferent depending on whether a title for
 * the tooltip is passed in, we have 2 different components below for each
 * scenario.
 */
// If they pass in a title, we need to change that title briefly to
// COPIED_MESSAGE whenever the content is copied.

function ClipboardLinkWithTitle(props) {
  const [currentTitle, setCurrentTitle] = useState(props.title);
  return /*#__PURE__*/React.createElement(Tooltip, _extends({}, props, {
    title: currentTitle,
    onClose: () => setCurrentTitle(props.title)
  }), props.children({
    copyString: content => {
      copy(content);
      setCurrentTitle(COPIED_MESSAGE);
    }
  }));
} // If they don't pass in a title, there should be no COPIED_MESSAGE tooltip
// shown until the content is copied.


function ClipboardLinkNoTitle(props) {
  const [showTooltip, setShowTooltip] = useState(false);
  return /*#__PURE__*/React.createElement(Tooltip, _extends({}, props, {
    title: COPIED_MESSAGE,
    open: showTooltip,
    onClose: () => setShowTooltip(false)
  }), props.children({
    copyString: content => {
      copy(content);
      setShowTooltip(true);
    }
  }));
}