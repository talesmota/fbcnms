function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 *
 * Edit's alertmanager's "global" config section. This feature is NOT available
 * in Magma NMS since it's multitenant.
 */
import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Editor from '../../common/Editor';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useForm from '../../../hooks/useForm';
import { makeStyles } from '@material-ui/styles';
import { useAlarmContext } from '../../AlarmContext';
import { useNetworkId } from '../../../components/hooks';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  loading: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
export default function GlobalConfig(props) {
  var _formState$http_confi, _formState$http_confi2, _formState$http_confi3, _formState$http_confi4, _formState$http_confi7, _formState$http_confi8;

  const classes = useStyles();
  const {
    apiUtil
  } = useAlarmContext();
  const snackbars = useSnackbars();
  const [lastRefreshTime, _setLastRefreshTime] = React.useState(new Date());
  const networkId = useNetworkId();
  const {
    response,
    isLoading
  } = apiUtil.useAlarmsApi(apiUtil.getGlobalConfig, {
    networkId
  }, lastRefreshTime.toLocaleString());
  const {
    formState,
    handleInputChange,
    updateFormState,
    setFormState
  } = useForm({
    initialState: {
      smtp_require_tls: true
    }
  });
  const updateHttpConfigState = React.useCallback(update => {
    updateFormState({
      http_config: { ...(formState.http_config || {}),
        ...update
      }
    });
  }, [formState, updateFormState]);
  React.useEffect(() => {
    if (response) {
      setFormState(response);
    }
  }, [response, setFormState]);
  const handleSave = React.useCallback(async () => {
    try {
      const formStateCleaned = removeEmptys(formState);
      await apiUtil.editGlobalConfig({
        config: formStateCleaned,
        networkId
      });
      snackbars.success('Successfully saved global config');
    } catch (error) {
      var _error$response, _error$response$data;

      snackbars.error(`Unable to save global config: ${error.response ? (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message : error.message}`);
    }
  }, [networkId, apiUtil, formState, snackbars]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: classes.loading
    }, /*#__PURE__*/React.createElement(CircularProgress, null));
  }

  return /*#__PURE__*/React.createElement(Grid, {
    className: classes.root,
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/React.createElement(Paper, {
    elevation: 1
  }, /*#__PURE__*/React.createElement(Editor, _extends({}, props, {
    onSave: handleSave,
    title: "Global Receiver Settings",
    description: "Default settings which apply to all receivers.",
    isNew: false
  }), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    direction: "column",
    spacing: 4
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Resolve Timeout",
    placeholder: "Ex: 5s"
  }, getIdProps('resolve_timeout'), {
    value: formState.resolve_timeout || '',
    onChange: handleInputChange(val => ({
      resolve_timeout: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "Slack"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://hooks.slack.com/services/T0/B0/XXX"
  }, getIdProps('slack_api_url'), {
    value: formState.slack_api_url || '',
    onChange: handleInputChange(val => ({
      slack_api_url: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "Pagerduty"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://api.pagerduty.com"
  }, getIdProps('pagerduty_url'), {
    value: formState.pagerduty_url || '',
    onChange: handleInputChange(val => ({
      pagerduty_url: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "SMTP"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "From",
    placeholder: "Ex: alert@terragraph.link"
  }, getIdProps('smtp_from'), {
    value: formState.smtp_from || '',
    onChange: handleInputChange(val => ({
      smtp_from: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "SMTP Hello",
    placeholder: "Ex: terragraph.link"
  }, getIdProps('smtp_hello'), {
    value: formState.smtp_hello || '',
    onChange: handleInputChange(val => ({
      smtp_hello: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Smarthost"
  }, getIdProps('smtp_smarthost'), {
    value: formState.smtp_smarthost || '',
    onChange: handleInputChange(val => ({
      smtp_smarthost: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Username"
  }, getIdProps('smtp_auth_username'), {
    value: formState.smtp_auth_username || '',
    onChange: handleInputChange(val => ({
      smtp_auth_username: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Password"
  }, getIdProps('smtp_auth_password'), {
    value: formState.smtp_auth_password || '',
    onChange: handleInputChange(val => ({
      smtp_auth_password: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Secret"
  }, getIdProps('smtp_auth_secret'), {
    value: formState.smtp_auth_secret || '',
    onChange: handleInputChange(val => ({
      smtp_auth_secret: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Identity"
  }, getIdProps('smtp_auth_identity'), {
    value: formState.smtp_auth_identity || '',
    onChange: handleInputChange(val => ({
      smtp_auth_identity: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(FormControlLabel, {
    control: /*#__PURE__*/React.createElement(Checkbox, {
      checked: // prevents uncontrolled->controlled error
      typeof formState.smtp_require_tls === 'boolean' ? formState.smtp_require_tls : true,
      onChange: handleInputChange((_, event) => {
        return {
          smtp_require_tls: event.target.checked
        };
      })
    }),
    label: "Require TLS"
  }))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "Opsgenie"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://api.opsgenie.com/"
  }, getIdProps('opsgenie_api_url'), {
    value: formState.opsgenie_api_url || '',
    onChange: handleInputChange(val => ({
      opsgenie_api_url: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API Key",
    placeholder: "Ex: xxxxxxxx-xxxx-xxxx-xxxxx-xxxxxxxxxxxx"
  }, getIdProps('opsgenie_api_key'), {
    value: formState.opsgenie_api_key || '',
    onChange: handleInputChange(val => ({
      opsgenie_api_key: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "Hipchat"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://api.hipchat.com/v2"
  }, getIdProps('hipchat_api_url'), {
    value: formState.hipchat_api_url || '',
    onChange: handleInputChange(val => ({
      hipchat_api_url: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API Key",
    placeholder: "Ex: xxx-xxx-xxxx"
  }, getIdProps('hipchat_auth_token'), {
    value: formState.hipchat_auth_token || '',
    onChange: handleInputChange(val => ({
      hipchat_auth_token: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "WeChat"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://qyapi.weixin.qq.com/cgi-bin/"
  }, getIdProps('wechat_api_url'), {
    value: formState.wechat_api_url || '',
    onChange: handleInputChange(val => ({
      wechat_api_url: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API Key",
    placeholder: "Ex: xxxxx"
  }, getIdProps('wechat_api_secret'), {
    value: formState.wechat_api_secret || '',
    onChange: handleInputChange(val => ({
      wechat_api_secret: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Corp ID",
    placeholder: "Ex: xxxxx"
  }, getIdProps('wechat_api_corp_id'), {
    value: formState.wechat_api_corp_id || '',
    onChange: handleInputChange(val => ({
      wechat_api_corp_id: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "VictorOps"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API URL",
    placeholder: "Ex: https://api.hipchat.com/v2"
  }, getIdProps('victorops_api_url'), {
    value: formState.victorops_api_url || '',
    onChange: handleInputChange(val => ({
      victorops_api_url: val
    })),
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "API Key",
    placeholder: "Ex: xxx-xxx-xxxx"
  }, getIdProps('victorops_api_key'), {
    value: formState.victorops_api_key || '',
    onChange: handleInputChange(val => ({
      victorops_api_key: val
    })),
    fullWidth: true
  })))), /*#__PURE__*/React.createElement(ConfigSection, {
    title: "HTTP"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({}, getIdProps('http_config_bearer_token'), {
    label: "Bearer Token",
    value: ((_formState$http_confi = formState.http_config) === null || _formState$http_confi === void 0 ? void 0 : _formState$http_confi.bearer_token) || '',
    onChange: e => {
      updateHttpConfigState({
        bearer_token: e.target.value
      });
    },
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Proxy URL"
  }, getIdProps('http_config_proxy_url'), {
    value: ((_formState$http_confi2 = formState.http_config) === null || _formState$http_confi2 === void 0 ? void 0 : _formState$http_confi2.proxy_url) || '',
    onChange: e => {
      updateHttpConfigState({
        proxy_url: e.target.value
      });
    },
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Basic Auth Username"
  }, getIdProps('basic_auth_username'), {
    value: ((_formState$http_confi3 = formState.http_config) === null || _formState$http_confi3 === void 0 ? void 0 : (_formState$http_confi4 = _formState$http_confi3.basic_auth) === null || _formState$http_confi4 === void 0 ? void 0 : _formState$http_confi4.username) || '',
    onChange: e => {
      var _formState$http_confi5, _formState$http_confi6;

      updateHttpConfigState({
        basic_auth: {
          username: e.target.value,
          password: ((_formState$http_confi5 = formState.http_config) === null || _formState$http_confi5 === void 0 ? void 0 : (_formState$http_confi6 = _formState$http_confi5.basic_auth) === null || _formState$http_confi6 === void 0 ? void 0 : _formState$http_confi6.password) || ''
        }
      });
    },
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(TextField, _extends({
    label: "Basic Auth Password"
  }, getIdProps('basic_auth_password'), {
    value: ((_formState$http_confi7 = formState.http_config) === null || _formState$http_confi7 === void 0 ? void 0 : (_formState$http_confi8 = _formState$http_confi7.basic_auth) === null || _formState$http_confi8 === void 0 ? void 0 : _formState$http_confi8.password) || '',
    onChange: e => {
      var _formState$http_confi9, _formState$http_confi10;

      updateHttpConfigState({
        basic_auth: {
          username: ((_formState$http_confi9 = formState.http_config) === null || _formState$http_confi9 === void 0 ? void 0 : (_formState$http_confi10 = _formState$http_confi9.basic_auth) === null || _formState$http_confi10 === void 0 ? void 0 : _formState$http_confi10.username) || '',
          password: e.target.value
        }
      });
    },
    fullWidth: true
  })))))))));
}

function ConfigSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    color: "textSecondary"
  }, title)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column"
  }, children));
} // Omit config keys that are set to empty strings


function removeEmptys(obj) {
  const cleaned = {};

  for (const key in obj) {
    const val = obj[key];

    if (typeof val === 'string') {
      if (val.trim() !== '') {
        cleaned[key] = val;
      }
    } else if (typeof val === 'object') {
      cleaned[key] = removeEmptys(val);
    } else {
      cleaned[key] = val;
    }
  }

  return cleaned;
}
/**
 * Handles setting id and data-testid to the same value. id is needed for
 * accessibility purposes so the label's for value is set correctly. testid is
 * used for testing.
 */


function getIdProps(id) {
  return {
    id,
    // inputProps targets the raw HTMLInputElement so tests can assert its value
    inputProps: {
      'data-testid': id
    }
  };
}