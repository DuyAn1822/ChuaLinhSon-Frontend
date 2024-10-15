import {
  CAvatar,
  CBadge,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CRow,
  CTableDataCell
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import apiClient from '../../../apiClient';
import '../../doan-sinh/DoanSinhCss/DanhSach.css';
import Table from '../../table/Table';
import CategoryCarousel from "../CategoryCarousel";
import '../TaiKhoan/TaiKhoan.css';
import UserModal from './UserModal';
import Swal from 'sweetalert2';

const statuses = {
  active: 'Active',
  inactive: 'Inactive',
  notAnAccount: `Haven't`,
  banned: 'Banned'
}

const getBadgeClass = (status) => {
  switch (status) {
    case statuses.active:
      return 'custom-badge-success';
    case statuses.inactive:
      return 'custom-badge-danger';
    case statuses.notAnAccount:
      return 'custom-badge-warning'
    case statuses.banned:
      return 'custom-badge-danger';
    default:
      return 'primary'
  }
}

const TaiKhoanHuynhTruong = () => {
  const [searchName, setSearchName] = useState('')
  const [searchRegistered, setSearchRegistered] = useState('')
  // const [searchRole, setSearchRole] = useState('')
  // const [searchStatus, setSearchStatus] = useState('')
  const [usersData, setUsersData] = useState([]);
  const [updated, setUpdated] = useState({});

  // const roleMapping = {
  //   ROLE_ADMIN: "Admin",
  //   ROLE_THUKY: "Thư ký",
  //   ROLE_THUQUY: "Thủ quỹ",
  //   ROLE_DOANTRUONG: "Đoàn trưởng",
  //   ROLE_DOANTRUONG_OANHVUNAM: "Đoàn trưởng Oanh Vũ Nam",
  //   ROLE_DOANTRUONG_OANHVUNU: "Đoàn trưởng Oanh Vũ Nữ",
  //   ROLE_DOANTRUONG_THIEUNAM: "Đoàn trưởng Thiếu Nam",
  //   ROLE_DOANTRUONG_THIEUNU: "Đoàn trưởng Thiếu Nữ",
  //   ROLE_DOANTRUONG_NGANHTHANH: "Đoàn trưởng Ngành Thanh"
  // };

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setSelectedUser(JSON.parse(user));
      setShowModal(true);
      sessionStorage.removeItem('user'); // Xóa thông tin người dùng sau khi đã sử dụng
    }
  }, []);

  const fetchAccountUsers = async () => {
    try {
      const response = await apiClient.get(`/api/account-users`);
      const users = response.data?.data?.map(user => {
        return {
          ...user,
          status: !user.accountDTO ? statuses.notAnAccount : user.accountDTO.isActive ? statuses.active : statuses.inactive
        }
      });
      setUsersData(users);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };
  useEffect(() => {
    fetchAccountUsers();
  }, [updated]);

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredData = usersData.filter((user) => {
    return (
      (searchName === '' || user.hoTen.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchRegistered === '' || formatDateToDDMMYYYY(user.accountDTO?.createdDate).includes(searchRegistered))
      // && (searchRole === '' || user.roleDTO1.toLowerCase().includes(searchRole.toLowerCase())) &&
      // (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase()))
    );
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleShowModal = (user) => {
    // console.dir(user);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const headers = [
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Ảnh</label>,
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Họ Và Tên</label>,
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Ngày Tạo</label>,
    <label width={'15%'} className="fixed-width-column d-block w-100 m-0">Vai trò 1</label>,
    <label width={'15%'} className="fixed-width-column d-block w-100 m-0">Vai trò 2</label>,
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Trạng thái</label>,
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Thao tác</label>,
  ];
  const headerCells = [
    '',
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Ngày Đăng Ký (dd-mm-yyyy)"
      value={searchRegistered}
      onChange={(e) => setSearchRegistered(e.target.value)}
    />,
    '',
    '',
    '',
    '',
  ];

  const renderRow = (user) => (
    <>
      <CTableDataCell>
        <CAvatar src={user.avatar} />
      </CTableDataCell>
      <CTableDataCell>{user.hoTen}</CTableDataCell>
      <CTableDataCell>{formatDateToDDMMYYYY(user.accountDTO?.createdDate)}</CTableDataCell>
      <CTableDataCell>{user.roleDTO1?.roleName}</CTableDataCell>
      <CTableDataCell>{user.roleDTO2?.roleName}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
          {user.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CDropdown>
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem className="custom-dropdown-item" variant="outline" onClick={() => handleShowModal(user)}>
              Thông tin
            </CDropdownItem>
            {
              user.status !== statuses.notAnAccount &&
              <CDropdownItem className="custom-dropdown-item"
                onClick={() => handleToggleStatus(user.accountDTO.accountId, !user.accountDTO.isActive)}>
                {user.status === statuses.active ? 'Tắt Trạng Thái' : 'Bật Trạng Thái'}
              </CDropdownItem>
            }
          </CDropdownMenu>
        </CDropdown>
      </CTableDataCell>
    </>
  );

  const handleToggleStatus = (accountId, isActive) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có đồng ý thực hiện thay đổi?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiClient.patch(`/api/accounts/${accountId}/activate?isActive=${isActive}`);
          let timerInterval;
          Swal.fire({
            title: "Vui lòng đợi xử lý thông tin!",
            // html: "Tự động đóng sau <b></b> mili giây.",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then(() => {
            // console.log(response.data, accountId, isActive, updated);
            setUpdated(response.data);
            Swal.fire({
              icon: 'success',
              title: 'Cập nhật thành công!'
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  return (
    <div className="container-fluid">
      <CategoryCarousel categories={usersData} />
      <br />
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Tài Khoản</h3>
        </CCol>
        {/* <CCol className="d-flex justify-content-end">
        </CCol> */}
      </CRow>
      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        // searchCriteria={{ searchName, searchRegistered, searchRole, searchStatus }}
        searchCriteria={{ searchName, searchRegistered }}
      />
      {selectedUser && (
        <UserModal
          show={showModal}
          handleClose={handleCloseModal}
          user={selectedUser}
          setUpdated={setUpdated}
        />
      )}
    </div>
  )
}

export default TaiKhoanHuynhTruong
