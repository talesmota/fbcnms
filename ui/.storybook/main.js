/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const customWebpackConfigBuilder = require('./webpack.config.js').default;

module.exports = {
  stories: ['../**/*.stories.@(js|mdx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: null,
      },
    },
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: config => customWebpackConfigBuilder({config}),
};
