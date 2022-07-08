/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {useAlarmContext} from '../../AlarmContext';

type Props = {
  onChange: (receiverName: string) => void,
  receiver: ?string,
};

export default function SelectReceiver({
  onChange,
  receiver,
  ...fieldProps
}: Props) {
  const {apiUtil} = useAlarmContext();
  const {match} = useRouter();
  const {isLoading, error, response} = apiUtil.useAlarmsApi(
    apiUtil.getReceivers,
    {
      networkId: match.params.networkId,
    },
  );
  const handleChange = React.useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Select
      {...fieldProps}
      id="select-receiver"
      data-testid="select-receiver"
      onChange={handleChange}
      defaultValue="Select Team"
      inputProps={{'data-testid': 'select-receiver-input'}}
      renderValue={value => (
        <Chip
          key={value}
          label={value}
          variant="outlined"
          color="primary"
          size="small"
        />
      )}
      value={receiver || ''}>
      <MenuItem value="" key={''}>
        None
      </MenuItem>
      {error && <MenuItem>Error: Could not load receivers</MenuItem>}
      {(response || []).map(receiver => (
        <MenuItem value={receiver.name} key={receiver.name}>
          {receiver.name}
        </MenuItem>
      ))}
    </Select>
  );
}
