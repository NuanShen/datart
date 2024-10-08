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
import { AuthenticationModeType, RowPermissionByType } from './constants';

export interface ShareDetail {
  authenticationMode: AuthenticationModeType;
  createBy: string;
  createTime: string | Date;
  expiryDate: string | Date;
  id: string;
  orgId: string;
  permission: null;
  roles: null | string[];
  users: null | string[];
  rowPermissionBy: RowPermissionByType;
  updateBy: null;
  updateTime: null | Date;
  vizId: string;
  vizType: 'DATACHART' | 'DASHBOARD' | 'STORYBOARD';
}

export interface EisMenuDetail {
  createBy: string;
  vizId: string;
  vizType: 'DATACHART' | 'DASHBOARD' | 'STORYBOARD';
  menuName: string;
  superCode: string;
  url: string;
  menuType: string;
  menuTarget: string;
  appId: string;
  isLeaf: string;
  levelId: string;
  menuPageFlag: string;
  datasource: string;
  createUser: string;

}
