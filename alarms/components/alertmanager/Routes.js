/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import SimpleTable, {toLabels} from '../table/SimpleTable';
import TableActionDialog from '../table/TableActionDialog';
import {makeStyles} from '@material-ui/styles';
import {useAlarmContext} from '../AlarmContext';
import {useNetworkId} from '../../components/hooks';
import {useSnackbars} from '@fbcnms/ui/hooks/useSnackbar';
import {useState} from 'react';

const useStyles = makeStyles(() => ({
  loading: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Routes() {
  const {apiUtil} = useAlarmContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState<?HTMLElement>(null);
  const [currentRow, setCurrentRow] = useState<{}>({});
  const [showDialog, setShowDialog] = useState<?'view'>(null);
  const [lastRefreshTime, _setLastRefreshTime] = useState<string>(
    new Date().toLocaleString(),
  );
  const classes = useStyles();
  const snackbars = useSnackbars();

  const onDialogAction = args => {
    setShowDialog(args);
    setMenuAnchorEl(null);
  };

  const networkId = useNetworkId();
  const {isLoading, error, response} = apiUtil.useAlarmsApi(
    apiUtil.getRouteTree,
    {networkId},
    lastRefreshTime,
  );

  if (error) {
    snackbars.error(
      `Unable to load receivers: ${
        error.response ? error.response.data.message : error.message
      }`,
    );
  }

  const routesList = response?.routes || [];

  return (
    <>
      <SimpleTable
        tableData={routesList}
        onActionsClick={(alert, target) => {
          setMenuAnchorEl(target);
          setCurrentRow(alert);
        }}
        columnStruct={[
          {title: 'name', getValue: row => row.receiver},
          {
            title: 'group by',
            getValue: row => row.group_by || [],
            render: 'list',
          },
          {
            title: 'match',
            getValue: row => (row.match ? toLabels(row.match) : {}),
            render: 'labels',
          },
        ]}
      />
      {isLoading && routesList.length === 0 && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}>
        <MenuItem onClick={() => onDialogAction('view')}>View</MenuItem>
      </Menu>
      <TableActionDialog
        open={showDialog != null}
        onClose={() => onDialogAction(null)}
        title={'View Alert'}
        row={currentRow || {}}
        showCopyButton={true}
        showDeleteButton={false}
      />
    </>
  );
}
