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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Editor from '../../common/Editor';
import EmailConfigEditor from './EmailConfigEditor';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PagerDutyConfigEditor from './PagerDutyConfigEditor';
import PushoverConfigEditor from './PushoverConfigEditor';
import SlackConfigEditor from './SlackConfigEditor';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WebhookConfigEditor from './WebhookConfigEditor';
import useForm from '../../../hooks/useForm';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import { useAlarmContext } from '../../AlarmContext';
import { useSnackbars } from '@fbcnms/ui/hooks/useSnackbar';
const CONFIG_TYPES = {
  slack: {
    friendlyName: 'Slack Channel',
    listName: 'slack_configs',
    createConfig: emptySlackReceiver,
    ConfigEditor: SlackConfigEditor
  },
  email: {
    friendlyName: 'Email',
    listName: 'email_configs',
    createConfig: emptyEmailReceiver,
    ConfigEditor: EmailConfigEditor
  },
  webhook: {
    friendlyName: 'Webhook',
    listName: 'webhook_configs',
    createConfig: emptyWebhookReceiver,
    ConfigEditor: WebhookConfigEditor
  },
  pagerduty: {
    friendlyName: 'PagerDuty',
    listName: 'pagerduty_configs',
    createConfig: emptyPagerDutyReceiver,
    ConfigEditor: PagerDutyConfigEditor
  },
  pushover: {
    friendlyName: 'Pushover',
    listName: 'pushover_configs',
    createConfig: emptyPushoverReceiver,
    ConfigEditor: PushoverConfigEditor
  }
};
export default function AddEditReceiver(props) {
  const {
    apiUtil
  } = useAlarmContext();
  const snackbars = useSnackbars();
  const {
    isNew,
    receiver,
    onExit
  } = props;
  const {
    match
  } = useRouter();
  const {
    formState,
    handleInputChange,
    updateListItem,
    removeListItem,
    addListItem
  } = useForm({
    initialState: receiver
  });
  const handleAddConfig = React.useCallback(configType => {
    const {
      listName,
      createConfig
    } = CONFIG_TYPES[configType];
    addListItem(listName, createConfig());
  }, [addListItem]);
  const handleSave = React.useCallback(() => {
    async function makeApiCall() {
      try {
        const request = {
          receiver: formState,
          networkId: match.params.networkId
        };

        if (isNew) {
          await apiUtil.createReceiver(request);
          onExit();
        } else {
          await apiUtil.editReceiver(request);
        }

        snackbars.success(`Successfully ${isNew ? 'added' : 'saved'} receiver`);
      } catch (error) {
        snackbars.error(`Unable to save receiver: ${error.response ? error.response.data.message : error.message}.`);
      }
    }

    makeApiCall();
  }, [apiUtil, formState, isNew, match.params.networkId, onExit, snackbars]);
  const configEditorSharedProps = {
    receiver,
    formState,
    updateListItem,
    removeListItem
  };
  return /*#__PURE__*/React.createElement(Editor, {
    xs: 8,
    isNew: isNew,
    onSave: handleSave,
    onExit: onExit,
    "data-testid": "add-edit-receiver",
    title: (receiver === null || receiver === void 0 ? void 0 : receiver.name) || 'New Receiver',
    description: "Configure channels to notify when an alert fires"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Typography, {
    paragraph: true
  }, "Details"), /*#__PURE__*/React.createElement(TextField, {
    required: true,
    id: "name",
    label: "Name",
    placeholder: "Ex: Support Team",
    disabled: !isNew,
    value: formState.name,
    onChange: handleInputChange(val => ({
      name: val
    })),
    fullWidth: true
  })))), Object.keys(CONFIG_TYPES).map(key => {
    const {
      friendlyName,
      createConfig,
      listName,
      ConfigEditor
    } = CONFIG_TYPES[key];
    const list = formState[listName];
    return /*#__PURE__*/React.createElement(ConfigSection, {
      title: friendlyName,
      onAddConfigClicked: () => handleAddConfig(key)
    }, list && list.map ? list.map((config, idx) => /*#__PURE__*/React.createElement(ConfigEditor, getConfigEditorProps({
      listName: listName,
      index: idx,
      createConfig,
      ...configEditorSharedProps
    }))) : null);
  }));
}

function ConfigSection({
  children,
  title,
  onAddConfigClicked
}) {
  return /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    wrap: "nowrap",
    spacing: 3
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    item: true,
    xs: 12,
    justify: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, null, title)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(IconButton, {
    edge: "end",
    onClick: onAddConfigClicked,
    "data-testid": `add-${title.replace(/\s/g, '')}`,
    "aria-label": "add new receiver configuration"
  }, /*#__PURE__*/React.createElement(AddCircleOutlineIcon, {
    color: "primary"
  })))), children))));
}

function emptySlackReceiver() {
  return {
    api_url: ''
  };
}

function emptyEmailReceiver() {
  return {
    from: '',
    to: '',
    smarthost: ''
  };
}

function emptyWebhookReceiver() {
  return {
    url: ''
  };
}

function emptyPagerDutyReceiver() {
  return {};
}

function emptyPushoverReceiver() {
  return {};
}
/**
 * Creates all the required props for a config editor.
 * Since config editors are rendered in a list and there is no unique
 * identifier, editing is done by list and by index (ie: slack_configs[0]).
 * This binds the callbacks to listname and index so the config editors don't
 * need to worry about their position in the list.
 */


function getConfigEditorProps({
  listName,
  index,
  receiver,
  formState,
  createConfig,
  updateListItem,
  removeListItem
}) {
  // The instance of a config such as ReceiverSlackConfig or ReceiverEmailConfig
  const config = formState[listName][index];
  const isNew = !receiver[listName] || !receiver[listName][index];

  const onUpdate = update => updateListItem(listName, index, update);

  const onDelete = () => removeListItem(listName, index);

  const onReset = () => updateListItem(listName, index,
  /**
   * When editing a config, the state of this config will be stored
   * untouched in the receiver object. If the receiver object does not
   * contain a definition for this config, it's new and we can reset it
   * by generating a new instance of the config
   */
  receiver[listName] && receiver[listName][index] ? receiver[listName][index] : null || createConfig());

  return {
    config,
    isNew,
    onUpdate,
    onReset,
    onDelete
  };
}