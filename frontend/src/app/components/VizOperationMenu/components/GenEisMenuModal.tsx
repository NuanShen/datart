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

import { Form, Modal, Select } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useMemberSlice } from 'app/pages/MainPage/pages/MemberPage/slice';
import { FC, memo, useCallback } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { SuperModules } from './slice/constants';
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

  const handleOkFn = useCallback(
    async ({
      expiryDate,
      authenticationMode,
      roles,
      users,
      rowPermissionBy,
    }) => {},
    [onOk, shareData],
  );

  return (
    <StyledGenEisMenuModal
      title={t('share.genEisMenu')}
      visible={visibility}
      okText={t('share.save')}
      onOk={() => handleOkFn?.({})}
      okButtonProps={{ loading: false }}
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
            onChange={undefined}
            placeholder={t('share.selectModule')}
            maxTagCount="responsive"
            optionFilterProp="label"
            value={[]}
          >
            {Object.keys(SuperModules).map(key => {
              return (
                <Select.Option key={key} value={key} label={SuperModules[key]}>
                  {SuperModules[key]}
                </Select.Option>
              );
            })}
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
