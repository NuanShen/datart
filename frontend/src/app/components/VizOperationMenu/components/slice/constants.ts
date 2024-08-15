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

export enum AuthenticationModeType {
  none = 'NONE',
  code = 'CODE',
  login = 'LOGIN',
}

export enum RowPermissionByType {
  creator = 'CREATOR',
  visitor = 'VISITOR',
}

export enum SuperModuleType {
  PM_M009 = '运营报表',
  FIN_M005 = '财务报表',
  BM_M004 = '预算报表',
  CRM_M008 = '商务报表',
  COMMON_M003 = '系统报表',
  FILEMANAGE_M003 = '质量报表',
  PROD_M003 = '产品报表',
  HR_M010 = '人力报表',
}
