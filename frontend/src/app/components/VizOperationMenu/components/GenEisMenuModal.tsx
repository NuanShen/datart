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

import { Form, Modal, Select, TreeSelect } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useMemberSlice } from 'app/pages/MainPage/pages/MemberPage/slice';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { request2 } from '../../../../utils/request';
import { SuperModules } from './slice/constants';
import { EisMenuDetail } from './slice/type';

const GenEisMenuModal: FC<{
  orgId: string;
  vizType: string;
  visibility: boolean;
  shareData?: EisMenuDetail | null;
  onOk?;
  onCancel?;
}> = memo(({ visibility, onOk, onCancel, shareData, orgId }) => {
  useMemberSlice();
  const t = useI18NPrefix(`viz.action`);
  const [eisModule, setEisModule] = useState<string | null>();
  const [eisRole, setEisRole] = useState<string[] | null>([]);
  const [roleTree, setRoleTree] = useState([]);
  const handleChangeModule = useCallback(module => {
    setEisModule(module);
  }, []);

  const handleChangeRoles = useCallback(roles => {
    setEisRole(roles);
  }, []);

  useEffect(() => {
    const fetchDataAndCache = async () => {
      try {
        const { data } = await request2({
          url: `/shares/roleTree`,
          method: 'GET',
        });
        setRoleTree(data as []);
        localStorage.setItem('roleTree', JSON.stringify(data));
      } catch (error) {
        console.error('角色查询失败:', error);
      }
    };

    // 检查缓存中是否有数据
    const cachedRoleTree = localStorage.getItem('roleTree');
    if (cachedRoleTree) {
      // 如果有缓存数据，使用缓存数据
      setRoleTree(JSON.parse(cachedRoleTree));
    } else {
      // 如果没有缓存数据，发起 API 请求
      fetchDataAndCache().then(r => {
        console.log('fetchDataAndCache', r);
      });
    }
  }, []);

  const handleOkFn = useCallback(
    async ({ eisModule, eisRole }) => {
      let paramsData = {
        superCode: eisModule,
        roleIds: eisRole,
        ...shareData,
      };
      await onOk(paramsData);
    },
    [onOk, shareData],
  );

  return (
    <StyledGenEisMenuModal
      title={t('share.genEisMenu')}
      visible={visibility}
      okText={t('share.save')}
      onOk={() =>
        handleOkFn?.({
          eisModule,
          eisRole,
        })
      }
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
            onChange={handleChangeModule}
            placeholder={t('share.selectModule')}
            maxTagCount="responsive"
            optionFilterProp="label"
            value={eisModule as string}
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
        <FormItemEx label={t('share.selectRole')}>
          <TreeSelect
            placeholder={t('share.selectRole')}
            treeData={roleTree}
            multiple
            allowClear
            onChange={handleChangeRoles}
          />
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
