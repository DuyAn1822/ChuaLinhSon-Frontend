import {
  cilBell,
  cilBook,
  cilFile,
  cilGroup,
  cilHouse,
  cilMoney,
  cilPlus,
  cilUserPlus,
  cilPencil,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import React from 'react';
const _nav = [
  {
    component: CNavItem,
    name: 'Trang Chủ',
    to: '/',
    icon: <CIcon icon={cilHouse} className='nav-icon' />
  },
  {
    component: CNavTitle,
    name: 'Quản Lý'
  },
  {
    component: CNavGroup,
    name: 'Danh Sách Đoàn Sinh',
    to: '/doan-sinh',
    icon: <CIcon icon={cilGroup} className='nav-icon' />,
    screen_id: '*.doan-sinh',
    items: [
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} className='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_OANHVUNAM],
        screen_id: '*.doan-sinh.doan-oanh-vu-nam',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nam',
            screen_id: '*.doan-sinh.doan-oanh-vu-nam.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nam',
            screen_id: '*.doan-sinh.doan-oanh-vu-nam.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nam',
            screen_id: '*.doan-sinh.doan-oanh-vu-nam.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-oanh-vu-nam',
            screen_id: '*.doan-sinh.doan-oanh-vu-nam.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} className='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_OANHVUNU],
        screen_id: '*.doan-sinh.doan-oanh-vu-nu',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nu',
            screen_id: '*.doan-sinh.doan-oanh-vu-nu.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nu',
            screen_id: '*.doan-sinh.doan-oanh-vu-nu.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nu',
            screen_id: '*.doan-sinh.doan-oanh-vu-nu.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-oanh-vu-nu',
            screen_id: '*.doan-sinh.doan-oanh-vu-nu.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} className='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_THIEUNAM],
        screen_id: '*.doan-sinh.doan-thieu-nam',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nam',
            screen_id: '*.doan-sinh.doan-thieu-nam.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nam',
            screen_id: '*.doan-sinh.doan-thieu-nam.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nam',
            screen_id: '*.doan-sinh.doan-thieu-nam.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-thieu-nam',
            screen_id: '*.doan-sinh.doan-thieu-nam.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} className='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_THIEUNU],
        screen_id: '*.doan-sinh.doan-thieu-nu',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nu',
            screen_id: '*.doan-sinh.doan-thieu-nu.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nu',
            screen_id: '*.doan-sinh.doan-thieu-nu.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nu',
            screen_id: '*.doan-sinh.doan-thieu-nu.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-thieu-nu',
            screen_id: '*.doan-sinh.doan-thieu-nu.doan-pha'
          }
        ],
      }, 
      {
        component: CNavGroup,
        name: 'Ngành Thanh',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} className='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_NGANHTHANH],
        screen_id: '*.doan-sinh.nganh-thanh',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-nganh-thanh',
            screen_id: '*.doan-sinh.nganh-thanh.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-nganh-thanh',
            screen_id: '*.doan-sinh.nganh-thanh.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-nganh-thanh',
            screen_id: '*.doan-sinh.nganh-thanh.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-nganh-thanh',
            screen_id: '*.doan-sinh.nganh-thanh.doan-pha'
          }
        ],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Huynh Trưởng',
    to: '/huynh-truong',
    icon: <CIcon icon={cilUserPlus} className='nav-icon' />,
    // role: [Role.ROLE_ADMIN],
    screen_id: '*.huynh-truong',
    items: [
      {
        component: CNavItem,
        name: 'Danh sách',
        to: '/huynh-truong/danh-sach',
        screen_id: '*.huynh-truong.danh-sach'
      },
      {
        component: CNavItem,
        name: 'Tài Khoản',
        to: '/huynh-truong/tai-khoan',
        screen_id: '*.huynh-truong.tai-khoan'
      },
      {
        component: CNavItem,
        name: 'Chức Vụ',
        to: '/chuc-vu',
        screen_id: '*.huynh-truong.chuc-vu'
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Quỹ Gia Đình',
    to: '/quygd',
    icon: <CIcon icon={cilMoney} className='nav-icon' />,
    role: ['Thủ Quỹ']
  },
  {
    component: CNavItem,
    name: 'Bậc Học',
    to: '/bac-hoc',
    icon: <CIcon icon={cilBook} className='nav-icon' />,
    screen_id: '*.bac-hoc'
  },
  {
    component: CNavTitle,
    name: 'Tài Liệu'
  },
  {
    component: CNavItem,
    name: 'File Lưu Trữ',
    to: '/file-luu-tru',
    icon: <CIcon icon={cilFile} className='nav-icon' />
  },
  {
    component: CNavTitle,
    name: 'Hệ Thống'
  },
  {
    component: CNavItem,
    name: 'Ghi Chú',
    to: '/ghi-chu',
    icon: <CIcon icon={cilPencil} className='nav-icon' />
  },
  {
    component: CNavItem,
    name: 'Thông Báo',
    to: '/thong-bao',
    icon: <CIcon icon={cilBell} className='nav-icon' />
  }, 
];


export default _nav
