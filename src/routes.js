import React from 'react'

const HomeDashboard = React.lazy(() => import('./views/home/HomeDashboard'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
// const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
// const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

//Oanh Nam
const DSOanhNam = React.lazy(() => import('./views/doan-sinh/oanh-vu-nam/DanhSach'))
const DDOanhNam = React.lazy(() => import('./views/doan-sinh/oanh-vu-nam/DiemDanh'))
const QDOanhNam = React.lazy(() => import('./views/doan-sinh/oanh-vu-nam/QuyDoan'))
const DPOanhNam = React.lazy(() => import('./views/doan-sinh/oanh-vu-nam/DoanPha/DoanPha'))

//Oanh Nữ
const DSOanhNu = React.lazy(() => import('./views/doan-sinh/oanh-vu-nu/DanhSach'))
const DDOanhNu = React.lazy(() => import('./views/doan-sinh/oanh-vu-nu/DiemDanh'))
const QDOanhNu = React.lazy(() => import('./views/doan-sinh/oanh-vu-nu/QuyDoan'))
const DPOanhNu = React.lazy(() => import('./views/doan-sinh/oanh-vu-nu/DoanPha/DoanPha'))

//Thiếu  Nam
const DSThieuNam = React.lazy(() => import('./views/doan-sinh/thieu-nam/DanhSach'))
const DDThieuNam = React.lazy(() => import('./views/doan-sinh/thieu-nam/DiemDanh'))
const QDThieuNam = React.lazy(() => import('./views/doan-sinh/thieu-nam/QuyDoan'))
const DPThieuNam = React.lazy(() => import('./views/doan-sinh/thieu-nam/DoanPha/DoanPha'))

//Thiếu  Nữ
const DSThieuNu = React.lazy(() => import('./views/doan-sinh/thieu-nu/DanhSach'))
const DDThieuNu = React.lazy(() => import('./views/doan-sinh/thieu-nu/DiemDanh'))
const QDThieuNu = React.lazy(() => import('./views/doan-sinh/thieu-nu/QuyDoan'))
const DPThieuNu = React.lazy(() => import('./views/doan-sinh/thieu-nu/DoanPha/DoanPha'))

//Ngành Thanh
const DSNganhThanh = React.lazy(() => import('./views/doan-sinh/nganh-thanh/DanhSach'))
const DDNganhThanh = React.lazy(() => import('./views/doan-sinh/nganh-thanh/DiemDanh'))
const QDNganhThanh = React.lazy(() => import('./views/doan-sinh/nganh-thanh/QuyDoan'))
const DPNganhThanh = React.lazy(() => import('./views/doan-sinh/nganh-thanh/DoanPha/DoanPha'))

//Tất Cả
const TatCa = React.lazy(() => import('./views/doan-sinh/TatCa.js'))

// Huynh Trưởng
const DanhSachHuynhTruong = React.lazy(() => import('./views/huynh-truong/DanhSach/DanhSach.js'))
//Tài Khoản
const TaiKhoanHuynhTruong = React.lazy(() => import('./views/huynh-truong/TaiKhoan/TaiKhoan.js'))

// File Lưu Trữ
const FileLuuTru = React.lazy(() => import('./views/file-luu-tru/FileLuuTru.js'))

const QuyGD = React.lazy(() => import('./views/huynh-truong/QuyGd.js'))

const ThongBao = React.lazy(() => import('./views/notification/notification.js'))

const BacHoc = React.lazy(() => import('./views/bac-hoc/BacHoc.js'))

const ChucVu = React.lazy(() => import('./views/huynh-truong/ChucVu/ChucVu.js'))

const GhiChu = React.lazy(() => import('./views/ghi-chu/GhiChu.js'))

const routes = [
  // { path: '/', name: 'Trang Chủ', element: HomeDashboard, screen_id: '*.trang-chu' },
  { path: '/', name: 'Trang Chủ', element: HomeDashboard },

  { path: '/doan-sinh/ds-thieu-nam', name: 'Danh Sách Thiếu Nam', element: DSThieuNam, screen_id: '*.doan-sinh.doan-thieu-nam.danh-sach' },
  { path: '/doan-sinh/qd-thieu-nam', name: 'Quỹ Đoàn Thiếu Nam', element: QDThieuNam, screen_id: '*.doan-sinh.doan-thieu-nam.quy-doan' },
  { path: '/doan-sinh/dd-thieu-nam', name: 'Điểm Danh Thiếu Nam', element: DDThieuNam, screen_id: '*.doan-sinh.doan-thieu-nam.diem-danh' },
  { path: '/doan-sinh/dp-thieu-nam', name: 'Đoàn Phả Thiếu Nam', element: DPThieuNam, screen_id: '*.doan-sinh.doan-thieu-nam.doan-pha' },

  { path: '/doan-sinh/ds-thieu-nu', name: 'Danh Sách Thiếu Nữ', element: DSThieuNu, screen_id: '*.doan-sinh.doan-thieu-nu.danh-sach' },
  { path: '/doan-sinh/qd-thieu-nu', name: 'Quỹ Đoàn Thiếu Nữ', element: QDThieuNu, screen_id: '*.doan-sinh.doan-thieu-nu.quy-doan' },
  { path: '/doan-sinh/dd-thieu-nu', name: 'Điểm Danh Thiếu Nữ', element: DDThieuNu, screen_id: '*.doan-sinh.doan-thieu-nu.diem-danh' },
  { path: '/doan-sinh/dp-thieu-nu', name: 'Đoàn Phả Thiếu Nữ', element: DPThieuNu, screen_id: '*.doan-sinh.doan-thieu-nu.doan-pha' },

  { path: '/doan-sinh/ds-oanh-vu-nam', name: 'Danh Sách Oanh Vũ Nam', element: DSOanhNam, screen_id: '*.doan-sinh.doan-oanh-vu-nam.danh-sach' },
  { path: '/doan-sinh/qd-oanh-vu-nam', name: 'Quỹ Đoàn Oanh Vũ Nam', element: QDOanhNam, screen_id: '*.doan-sinh.doan-oanh-vu-nam.quy-doan' },
  { path: '/doan-sinh/dd-oanh-vu-nam', name: 'Điểm Danh Oanh Vũ Nam', element: DDOanhNam, screen_id: '*.doan-sinh.doan-oanh-vu-nam.diem-danh' },
  { path: '/doan-sinh/dp-oanh-vu-nam', name: 'Đoàn Phả Oanh Vũ Nam', element: DPOanhNam, screen_id: '*.doan-sinh.doan-oanh-vu-nam.doan-pha' },

  { path: '/doan-sinh/ds-oanh-vu-nu', name: 'Danh Sách Oanh Vũ Nữ', element: DSOanhNu, screen_id: '*.doan-sinh.doan-oanh-vu-nu.danh-sach' },
  { path: '/doan-sinh/qd-oanh-vu-nu', name: 'Quỹ Đoàn Oanh Vũ Nữ', element: QDOanhNu, screen_id: '*.doan-sinh.doan-oanh-vu-nu.quy-doan' },
  { path: '/doan-sinh/dd-oanh-vu-nu', name: 'Điểm Danh Oanh Vũ Nữ', element: DDOanhNu, screen_id: '*.doan-sinh.doan-oanh-vu-nu.diem-danh' },
  { path: '/doan-sinh/dp-oanh-vu-nu', name: 'Đoàn Phả Oanh Vũ Nữ', element: DPOanhNu, screen_id: '*.doan-sinh.doan-oanh-vu-nu.doan-pha' },

  { path: '/doan-sinh/ds-nganh-thanh', name: 'Danh Sách Ngành Thanh', element: DSNganhThanh, screen_id: '*.doan-sinh.doan-nganh-thanh.danh-sach' },
  { path: '/doan-sinh/qd-nganh-thanh', name: 'Quỹ Đoàn Ngành Thanh', element: QDNganhThanh, screen_id: '*.doan-sinh.doan-nganh-thanh.quy-doan' },
  { path: '/doan-sinh/dd-nganh-thanh', name: 'Điểm Danh Ngành Thanh', element: DDNganhThanh, screen_id: '*.doan-sinh.doan-nganh-thanh.diem-danh' },
  { path: '/doan-sinh/dp-nganh-thanh', name: 'Đoàn Phả Ngành Thanh', element: DPNganhThanh, screen_id: '*.doan-sinh.doan-nganh-thanh.doan-pha' },

  { path: '/doan-sinh/ds-doan-sinh/tat-ca', name: 'Tất Cả', element: TatCa, screen_id: '*.doan-sinh.tat-ca' },

  { path: '/huynh-truong/danh-sach', name: 'Danh Sách Huynh Trưởng', element: DanhSachHuynhTruong, screen_id: '*.huynh-truong.danh-sach' },
  { path: '/huynh-truong/tai-khoan', name: 'Danh Sách Tài Khoản', element: TaiKhoanHuynhTruong, screen_id: '*.huynh-truong.tai-khoan' },
  { path: '/chuc-vu', name: 'Chức Vụ', element: ChucVu, screen_id: '*.huynh-truong.chuc-vu' },
  // { path: '/file-luu-tru', name: 'File Lưu Trữ', element: FileLuuTru, screen_id: '*.file-luu-tru' },
  { path: '/file-luu-tru', name: 'File Lưu Trữ', element: FileLuuTru },
  { path: '/quygd', name: 'Quỹ Gia Đình', element: QuyGD, role: ['Thủ Quỹ'] },
  { path: '/thong-bao', name: 'Thông Báo', element: ThongBao },
  { path: '/bac-hoc', name: 'Bậc Học', element: BacHoc, screen_id: '*.bac-hoc' },
  { path: '/ghi-chu', name: 'Ghi Chú', element: GhiChu, screen_id: '*.ghi-chu' },
];


// const routes = [
//   // { path: '/', exact: true, name: 'Trang Chủ' },
//   { path: '/', name: 'Trang Chủ', element: HomeDashboard },
//   // { path: '/theme', name: 'Theme', element: Colors, exact: true },
//   // { path: '/theme/colors', name: 'Colors', element: Colors },
//   // { path: '/theme/typography', name: 'Typography', element: Typography },
//   // { path: '/base', name: 'Base', element: Cards, exact: true },
//   // { path: '/base/accordion', name: 'Accordion', element: Accordion },
//   // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
//   // { path: '/base/cards', name: 'Cards', element: Cards },
//   // { path: '/base/carousels', name: 'Carousel', element: Carousels },
//   // { path: '/base/collapses', name: 'Collapse', element: Collapses },
//   // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
//   // { path: '/base/navs', name: 'Navs', element: Navs },
//   // { path: '/base/paginations', name: 'Paginations', element: Paginations },
//   // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
//   // { path: '/base/popovers', name: 'Popovers', element: Popovers },
//   // { path: '/base/progress', name: 'Progress', element: Progress },
//   // { path: '/base/spinners', name: 'Spinners', element: Spinners },
//   // { path: '/base/tabs', name: 'Tabs', element: Tabs },
//   // { path: '/base/tables', name: 'Tables', element: Tables },
//   // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
//   // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
//   // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
//   // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
//   // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
//   // { path: '/charts', name: 'Charts', element: Charts },
//   // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
//   // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
//   // { path: '/forms/select', name: 'Select', element: Select },
//   // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
//   // { path: '/forms/range', name: 'Range', element: Range },
//   // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
//   // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
//   // { path: '/forms/layout', name: 'Layout', element: Layout },
//   // { path: '/forms/validation', name: 'Validation', element: Validation },
//   // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
//   // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
//   // { path: '/icons/flags', name: 'Flags', element: Flags },
//   // { path: '/icons/brands', name: 'Brands', element: Brands },
//   // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
//   // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
//   // { path: '/notifications/badges', name: 'Badges', element: Badges },
//   // { path: '/notifications/modals', name: 'Modals', element: Modals },
//   // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
//   // { path: '/widgets', name: 'Widgets', element: Widgets },


//   // { path: '/doan-sinh/ds-doan-sinh', name: 'Danh Sách Đoàn Sinh', exact: true },


//   { path: '/doan-sinh/ds-oanh-vu-nam', name: 'Danh Sách Oanh Vũ Nam', element: DSOanhNam, role: [Role.ROLE_DOANTRUONG_OANHVUNAM] },
//   { path: '/doan-sinh/qd-oanh-vu-nam', name: 'Quỹ Đoàn Oanh Vũ Nam', element: QDOanhNam, role: [Role.ROLE_DOANTRUONG_OANHVUNAM] },
//   { path: '/doan-sinh/dd-oanh-vu-nam', name: 'Điểm Danh Oanh Vũ Nam', element: DDOanhNam, role: [Role.ROLE_DOANTRUONG_OANHVUNAM] },
//   { path: '/doan-sinh/dp-oanh-vu-nam', name: 'Đoàn Phả Oanh Vũ Nam', element: DPOanhNam, role: [Role.ROLE_DOANTRUONG_OANHVUNAM] },

//   { path: '/doan-sinh/ds-oanh-vu-nu', name: 'Danh Sách Oanh Vũ Nữ', element: DSOanhNu, role: [Role.ROLE_DOANTRUONG_OANHVUNU] },
//   { path: '/doan-sinh/qd-oanh-vu-nu', name: 'Quỹ Đoàn Oanh Vũ Nữ', element: QDOanhNu, role: [Role.ROLE_DOANTRUONG_OANHVUNU] },
//   { path: '/doan-sinh/dd-oanh-vu-nu', name: 'Điểm Danh Oanh Vũ Nữ', element: DDOanhNu, role: [Role.ROLE_DOANTRUONG_OANHVUNU] },
//   { path: '/doan-sinh/dp-oanh-vu-nu', name: 'Đoàn Phả Oanh Vũ Nữ', element: DPOanhNu, role: [Role.ROLE_DOANTRUONG_OANHVUNU] },

//   { path: '/doan-sinh/ds-thieu-nam', name: 'Danh Sách Thiếu Nam', element: DSThieuNam, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },
//   { path: '/doan-sinh/qd-thieu-nam', name: 'Quỹ Đoàn Thiếu Nam', element: QDThieuNam, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },
//   { path: '/doan-sinh/dd-thieu-nam', name: 'Điểm Danh Thiếu Nam', element: DDThieuNam, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },
//   { path: '/doan-sinh/dp-thieu-nam', name: 'Đoàn Phả Thiếu Nam', element: DPThieuNam, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },

//   { path: '/doan-sinh/ds-thieu-nu', name: 'Danh Sách Thiếu Nữ', element: DSThieuNu, role: [Role.ROLE_DOANTRUONG_THIEUNU] },
//   { path: '/doan-sinh/qd-thieu-nu', name: 'Quỹ Đoàn Thiếu Nữ', element: QDThieuNu, role: [Role.ROLE_DOANTRUONG_THIEUNU] },
//   { path: '/doan-sinh/dd-thieu-nu', name: 'Điểm Danh Thiếu Nữ', element: DDThieuNu, role: [Role.ROLE_DOANTRUONG_THIEUNU] },
//   { path: '/doan-sinh/dp-thieu-nu', name: 'Đoàn Phả Thiếu Nữ', element: DPThieuNu, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },

//   { path: '/doan-sinh/ds-nganh-thanh', name: 'Danh Sách Ngành Thanh', element: DSNganhThanh, role: [Role.ROLE_DOANTRUONG_NGANHTHANH] },
//   { path: '/doan-sinh/qd-nganh-thanh', name: 'Quỹ Đoàn Ngành Thanh', element: QDNganhThanh, role: [Role.ROLE_DOANTRUONG_NGANHTHANH] },
//   { path: '/doan-sinh/dd-nganh-thanh', name: 'Điểm Danh Ngành Thanh', element: DDNganhThanh, role: [Role.ROLE_DOANTRUONG_NGANHTHANH] },
//   { path: '/doan-sinh/dp-nganh-thanh', name: 'Đoàn Phả Ngành Thanh', element: DPNganhThanh, role: [Role.ROLE_DOANTRUONG_THIEUNAM] },




//   { path: '/doan-sinh/ds-doan-sinh/tat-ca', name: 'Tất Cả', element: TatCa, role: [Role.ROLE_ADMIN] },
//   // { path: '/doan-sinh/diem-danh', name: 'Điểm Danh', element: DiemDanh },
//   // { path: '/doan-sinh/quy-doan', name: 'Quỹ Đoàn', element: QuyDoan },
//   // { path: '/huynh-truong', name: 'Huynh Trưởng', exact: true },
//   { path: '/huynh-truong/danh-sach', name: 'Danh Sách Huynh Trưởng', element: DanhSachHuynhTruong, role: [Role.ROLE_ADMIN] },
//   { path: '/huynh-truong/tai-khoan', name: 'Danh Sách Tài Khoản', element: TaiKhoanHuynhTruong, role: [Role.ROLE_ADMIN] },
//   { path: '/file-luu-tru', name: 'File Lưu Trữ', element: FileLuuTru },
//   { path: '/quygd', name: 'Quỹ Gia Đình', element: QuyGD, role: [Role.ROLE_THUQUY] },
//   { path: '/thong-bao', name: 'Thông Báo', element: ThongBao },
//   { path: '/bac-hoc', name: 'Bậc Học', element: BacHoc },
//   { path: '/chuc-vu', name: 'Chức Vụ', element: ChucVu },
// ]

export default routes
  