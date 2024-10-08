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

import { Button, Empty, message, Modal, Popconfirm, Space, Table } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import produce from 'immer';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';
import { getServerDomain, request2 } from 'utils/request';
import GenEisMenuModal from './GenEisMenuModal';
import ShareLinkModal from './ShareLinkModal';
import { EisMenuDetail, ShareDetail } from './slice/type';

const ShareManageModal: FC<{
  vizId: string;
  title: string;
  orgId: string;
  vizType: string;
  visibility: boolean;
  onGenerateShareLink?: ({
    expiryDate,
    authenticationMode,
    roles,
    users,
    rowPermissionBy,
  }: {
    expiryDate: string;
    authenticationMode: string;
    roles: string[];
    users: string[];
    rowPermissionBy: string;
  }) => any;
  onOk?;
  onCancel?;
}> = memo(
  ({
    visibility,
    onGenerateShareLink,
    onOk,
    onCancel,
    vizType,
    vizId,
    title,
    orgId,
  }) => {
    const [showShareLinkModal, setShowShareLinkModal] = useState(false);
    const [showGenEisMenuModal, setShowGenEisMenuModal] = useState(false);
    const [listData, setListData] = useState<ShareDetail[]>([]);
    const [manipulatedData, setManipulatedData] = useState<ShareDetail | null>(
      null,
    );
    const [eisMenuData, setEisMenuData] = useState<EisMenuDetail | null>(null);
    const t = useI18NPrefix(`viz.action`);

    const fetchShareListFn = useCallback(async () => {
      const { data } = await request2<ShareDetail[]>({
        url: `/shares/${vizId}`,
        method: 'GET',
      });
      setListData(data);
    }, [vizId]);

    const upDateShareLink = useCallback(
      async paramsData => {
        const { id } = paramsData;
        const { data } = await request2({
          url: `/shares/${id}`,
          method: 'PUT',
          data: paramsData,
        });
        setManipulatedData(null);
        if (data) {
          setListData(
            produce(listData, draft => {
              const Index = draft.findIndex(v => v.id === id);
              draft[Index] = Object.assign(paramsData, data, { vizType });
            }),
          );
        }
      },
      [listData, vizType],
    );

    const creatShareLinkFn = useCallback(
      async paramsData => {
        const data = await onGenerateShareLink?.(paramsData);
        if (data) {
          setListData([
            {
              ...paramsData,
              ...data,
              vizType,
            },
            ...listData,
          ]);
        }
        setShowShareLinkModal(false);
      },
      [setShowShareLinkModal, listData, onGenerateShareLink, vizType],
    );

    const creatEisMenuFn = useCallback(
      async paramsData => {
        try {
          const { data } = await request2({
            url: `/shares/genEisMenu`,
            method: 'POST',
            data: paramsData,
          });
          console.log('data', data);
          message.success('保存成功');
          setShowGenEisMenuModal(false);
        } catch (err) {
          message.error('保存失败：' + err);
          throw err;
        }
      },
      [setShowGenEisMenuModal],
    );

    const deleteShareLinkFn = useCallback(
      async (id, index) => {
        try {
          await request2({
            url: `/shares/${id}`,
            method: 'DELETE',
          });
          setListData(
            produce(listData, draft => {
              draft.splice(index, 1);
            }),
          );
        } catch (err) {
          message.error(t('shareList.deleteError'));
          throw err;
        }
      },
      [listData, t],
    );

    const getFullShareLinkPath = useCallback(
      shareData => {
        const urlRouter = {
          DASHBOARD: 'shareDashboard',
          DATACHART: 'shareChart',
          STORYBOARD: 'shareStoryPlayer',
        };
        let copyUrl: string = `${getServerDomain()}/${
          urlRouter[shareData.vizType]
        }/${shareData.id}?type=${shareData.authenticationMode}`;

        if (shareData.authenticationMode === 'CODE') {
          copyUrl = `${t('share.link')}：${copyUrl} ${t('share.password')}：${
            shareData.authenticationCode
          }`;
        }
        return copyUrl;
      },
      [t],
    );

    /*const handleCopyToClipboard = useCallback(
      shareData => {
        const copyUrl = getFullShareLinkPath(shareData);
        const ta = document.createElement('textarea');

        ta.innerText = copyUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        message.success(t('shareList.copySuccess'));
      },
      [t, getFullShareLinkPath],
    );*/

    const handleCancelModalFn = useCallback(() => {
      setManipulatedData(null);
      setEisMenuData(null);
      setShowShareLinkModal(false);
      setShowGenEisMenuModal(false);
    }, []);

    const handleOperateFn = useCallback((share: ShareDetail) => {
      setManipulatedData(share);
      setShowShareLinkModal(true);
    }, []);

    const handleGenEisMenuFn = useCallback(
      (eisMenu: EisMenuDetail) => {
        eisMenu.menuName = title;
        eisMenu.url = getFullShareLinkPath(eisMenu);
        eisMenu.menuType = '3';
        eisMenu.menuTarget = 'newWin';
        eisMenu.appId = '100';
        eisMenu.isLeaf = '1';
        eisMenu.levelId = '3';
        eisMenu.menuPageFlag = '0';
        eisMenu.datasource = 'dic';
        setEisMenuData(eisMenu);
        setShowGenEisMenuModal(true);
      },
      [getFullShareLinkPath, title],
    );

    const handleOkFn = useCallback(
      async paramsData => {
        const { id } = paramsData;
        if (id) {
          await upDateShareLink(paramsData);
        } else {
          await creatShareLinkFn(paramsData);
        }
        setShowShareLinkModal(false);
      },
      [upDateShareLink, creatShareLinkFn],
    );

    const handleEisMenuOkFn = useCallback(
      async paramsData => {
        await creatEisMenuFn(paramsData);
        setShowGenEisMenuModal(false);
      },
      [creatEisMenuFn],
    );

    const columns = useMemo(() => {
      return [
        {
          title: t('shareList.shortLink'),
          dataIndex: 'id',
          render: (value, share) => {
            return <LinkWrapper>{getFullShareLinkPath(share)}</LinkWrapper>;
          },
        },
        {
          title: t('shareList.type'),
          dataIndex: 'authenticationMode',
          render: value => {
            return t(`share.${value}`);
          },
        },
        {
          title: t('shareList.expireDate'),
          dataIndex: 'expiryDate',
          render: res => {
            return res || t('shareList.Permanent');
          },
        },
        {
          title: t('shareList.operate'),
          dataIndex: 'id',
          render: (value, share, index) => {
            return (
              <Space>
                {/*<Button
                  type="primary"
                  ghost
                  onClick={() => {
                    handleCopyToClipboard(share);
                  }}
                >
                  {t('shareList.copy')}
                </Button>*/}
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    handleOperateFn(share);
                  }}
                >
                  {t('shareList.operate')}
                </Button>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    handleGenEisMenuFn(share);
                  }}
                >
                  {t('shareList.genEisMenu')}
                </Button>
                <Popconfirm
                  title={t('shareList.sureDelete')}
                  onConfirm={() => {
                    deleteShareLinkFn(value, index);
                  }}
                >
                  <Button danger>{t('shareList.delete')}</Button>
                </Popconfirm>
              </Space>
            );
          },
        },
      ];
    }, [
      t,
      handleOperateFn,
      handleGenEisMenuFn,
      // handleCopyToClipboard,
      deleteShareLinkFn,
      getFullShareLinkPath,
    ]);

    useEffect(() => {
      if (visibility) {
        fetchShareListFn();
      }
    }, [fetchShareListFn, visibility]);

    return (
      <StyledShareLinkModal
        width={1200}
        title={
          <ModalHeader>
            <span>{t('shareList.shareList')}</span>
            <Button
              type="primary"
              onClick={() => {
                setShowShareLinkModal(true);
              }}
            >
              {t('shareList.addLink')}
            </Button>
          </ModalHeader>
        }
        visible={visibility}
        onOk={onOk}
        onCancel={onCancel}
        destroyOnClose
        closable={false}
      >
        <Table
          pagination={false}
          dataSource={listData}
          columns={columns}
          scroll={{ y: 500 }}
          locale={{
            emptyText: <Empty description={t('shareList.noDataTip')}></Empty>,
          }}
        ></Table>
        <ShareLinkModal
          shareData={manipulatedData}
          orgId={orgId}
          vizType={vizType}
          visibility={showShareLinkModal}
          onOk={handleOkFn}
          onCancel={handleCancelModalFn}
        ></ShareLinkModal>
        <GenEisMenuModal
          shareData={eisMenuData}
          orgId={orgId}
          vizType={vizType}
          visibility={showGenEisMenuModal}
          onOk={handleEisMenuOkFn}
          onCancel={handleCancelModalFn}
        ></GenEisMenuModal>
      </StyledShareLinkModal>
    );
  },
);

export default ShareManageModal;

const StyledShareLinkModal = styled(Modal)`
  .ant-modal-header {
    padding-right: ${SPACE_TIMES(4)};
    padding-left: ${SPACE_TIMES(4)};
  }

  .ant-modal-body {
    padding: 0px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LinkWrapper = styled.span`
  color: ${p => p.theme.primary};
`;
