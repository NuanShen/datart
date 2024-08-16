/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DatePicker, Form, Modal, Radio, Select, Space } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useMemberSlice } from 'app/pages/MainPage/pages/MemberPage/slice';
import {
  selectMembers,
  selectRoles as rdxSelectRoles,
} from 'app/pages/MainPage/pages/MemberPage/slice/selectors';
import {
  getMembers,
  getRoles,
} from 'app/pages/MainPage/pages/MemberPage/slice/thunks';
import { selectIsOrgOwner } from 'app/pages/MainPage/slice/selectors';
import { TIME_FORMATTER } from 'globalConstants';
import moment from 'moment';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { AuthenticationModeType, RowPermissionByType, SuperModuleType } from './slice/constants';
import { ShareDetail } from './slice/type';

const GenEisMenuModal: FC<{
  orgId: string;
  vizType: string;
  visibility: boolean;
  shareData?: ShareDetail | null;
  onOk?;
  onCancel?;
}> = memo(({ visibility, onOk, onCancel, shareData, orgId }) => {
  useMemberSlice();

  const t = useI18NPrefix(`viz.action`);
  const dispatch = useDispatch();
  const [expiryDate, setExpiryDate] = useState<string | Date>('');
  const [authenticationMode, setAuthenticationMode] = useState(
    AuthenticationModeType.none,
  );
  const [rowPermissionBy, setRowPermissionBy] = useState('');
  const [selectUsers, setSelectUsers] = useState<string[] | null>([]);
  const [selectRoles, setSelectRoles] = useState<string[] | null>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const usersList = useSelector(selectMembers);
  const rolesList = useSelector(rdxSelectRoles);
  const isOwner = useSelector(selectIsOrgOwner);

  const handleOkFn = useCallback(
    async ({
      expiryDate,
      authenticationMode,
      roles,
      users,
      rowPermissionBy,
    }) => {
      setBtnLoading(true);

      try {
        let paramsData = {
          expiryDate,
          authenticationMode,
          roles,
          users,
          rowPermissionBy,
        };
        if (shareData) {
          paramsData = Object.assign({}, shareData, paramsData);
        }

        await onOk(paramsData);
        setBtnLoading(false);
      } catch (err) {
        setBtnLoading(false);
        throw err;
      }
    },
    [onOk, shareData],
  );

  const handleAuthenticationMode = useCallback(async e => {
    const value = e.target.value;

    setSelectRoles([]);
    setSelectUsers([]);
    setRowPermissionBy('');

    if (value === AuthenticationModeType.login) {
      setRowPermissionBy(RowPermissionByType.visitor);
    }

    setAuthenticationMode(e.target.value);
  }, []);

  const handleRowPermissionBy = useCallback(e => {
    setRowPermissionBy(e.target.value);
  }, []);

  const handleChangeMembers = useCallback(users => {
    setSelectUsers(users);
  }, []);

  const handleChangeRoles = useCallback(roles => {
    setSelectRoles(roles);
  }, []);

  const handleDefauleValue = useCallback((shareData: ShareDetail) => {
    setExpiryDate(shareData.expiryDate);
    setAuthenticationMode(shareData.authenticationMode);
    setRowPermissionBy(shareData.rowPermissionBy);
    setSelectUsers(shareData.users);
    setSelectRoles(shareData.roles);
  }, []);

  useEffect(() => {
    if (isOwner) {
      dispatch(getRoles(orgId));
      dispatch(getMembers(orgId));
    }
  }, [orgId, dispatch, isOwner]);

  useEffect(() => {
    shareData && handleDefauleValue(shareData);
  }, [handleDefauleValue, shareData]);

  return (
    <StyledGenEisMenuModal
      title={t('share.shareLink')}
      visible={visibility}
      okText={t('share.save')}
      onOk={() =>
        handleOkFn?.({
          expiryDate,
          authenticationMode,
          roles: selectRoles,
          users: selectUsers,
          rowPermissionBy,
        })
      }
      okButtonProps={{ loading: btnLoading }}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form
        preserve={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <FormItemEx label={t('share.selectModule')}>
          <StyledSelection
            onChange={handleChangeMembers}
            placeholder={t('share.selectModule')}
            maxTagCount="responsive"
            optionFilterProp="label"
            value={selectUsers || []}
          >
            <Select.Option key={1} value={'PM_M009'} label={'运营报表'}>{'运营报表'}</Select.Option>
            <Select.Option key={2} value={'FIN_M005'} label={'财务报表'}>{'财务报表'}</Select.Option>
            <Select.Option key={4} value={'BM_M004'} label={'预算报表'}>{'预算报表'}</Select.Option>
            <Select.Option key={5} value={'CRM_M008'} label={'商务报表'}>{'商务报表'}</Select.Option>
            <Select.Option key={6} value={'COMMON_M003'} label={'系统报表'}>{'系统报表'}</Select.Option>
            <Select.Option key={7} value={'FILEMANAGE_M003'} label={'质量报表'}>{'质量报表'}</Select.Option>
            <Select.Option key={8} value={'PROD_M003'} label={'产品报表'}>{'产品报表'}</Select.Option>
            <Select.Option key={9} value={'HR_M010'} label={'人力报表'}>{'人力报表'}</Select.Option>
          </StyledSelection>
        </FormItemEx>
      </Form>
    </StyledGenEisMenuModal>
  );
});

export default GenEisMenuModal;

const StyledGenEisMenuModal = styled(Modal)`
  & .ant-modal-body .ant-row {
    margin-top: ${SPACE};
    margin-bottom: ${SPACE};
  }
`;

const StyledSelection = styled(Select)`
  min-width: 100px;
`;
