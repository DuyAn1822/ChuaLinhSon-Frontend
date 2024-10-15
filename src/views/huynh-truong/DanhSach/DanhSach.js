import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CAvatar,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
} from '@coreui/react'

import './DanhSach.css'
import Table from '../../table/Table'
import CategoryCarousel from "../CategoryCarousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserModal from './UserModal';
import '../../doan-sinh/DoanSinhCss/DanhSach.css'
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import AddHuynhTruongModal from './AddHuynhTruongModal';






const DSHuynhTruong = () => {
  const [searchName, setSearchName] = useState('')
  const [usersData, setUsersData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const [filename, setFilename] = useState('DanhSachHuynhTruong.xlsx');

  useEffect(() => {
    layDuLieu();
  }, []);

  const layDuLieu = async () => {
    try {
      let isHuynhTruong = true;
      const response = await apiClient.get(`/api/users/get-list-huynh-truong/${isHuynhTruong}`);

      // console.log(response.data.data);

      const fetchedData = await Promise.all(response.data.data.map(async (item) => {
        return {
          userId: item.userId,
          userIdUx: item.userIdUx,
          hoTen: item.hoTen,
          ngaySinh: item.ngaySinh,
          sdt: item.sdt,
          email: item.email,
          phapDanh: item.phapDanh,
          gioiTinh: item.gioiTinh,
          createdDate: item.createdDate,
          isHuynhTruong: item.isHuynhTruong,
          updatedDate: item.updatedDate,
          diaChi: item.diaChi,
          avatar: item.avatar,
          isActive: item.isActive,
          roleId1: item.roleId1,
          roleId2: item.roleId2,
          accountDTO: item.accountDTO,
          nhiemKyDoans: item.nhiemKyDoans,
          doanSinhDetails: item.doanSinhDetails,
          lichSuHocs: item.lichSuHocs,
          lichSuCapDTOS: item.lichSuCapDTOS,
          lichSuTraiHuanLuyenDTOS: item.lichSuTraiHuanLuyenDTOS,
          hoTenCha: item.hoTenCha,
          hoTenMe: item.hoTenMe,
          hoTenNguoiTruyenGioi: item.hoTenNguoiTruyenGioi,
          ngayQuyY: item.ngayQuyY,
          noiSinh: item.noiSinh,
          sdtCha: item.sdtCha,
          sdtMe: item.sdtMe,
          ngayPhatNguyen: item.ngayPhatNguyen,
        };
      }));
      setUsersData(fetchedData);
      // console.log(fetchedData);


    } catch (error) {

      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleAddHuynhTruong = () => {
    layDuLieu();
  };

  const handleChangeHuynhTruong = () => {
    layDuLieu();
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case true:
        return 'custom-badge-success';
      case false:
        return 'custom-badge-danger';
    }
  }

  const handleToggleStatus = async (user) => {
    // const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn có muốn ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'} người dùng này không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, thay đổi nó!',
      cancelButtonText: 'Hủy'
    });

    if (user.isActive) {
      var newIsActive = false;
    } else {
      var newIsActive = true;
    }

    if (result.isConfirmed) {
      try {
        await apiClient.put(`/api/users/active-user/${user.userId}/${newIsActive}`, null);

        // Cập nhật trạng thái người dùng trong dữ liệu local state
        setUsersData(prevUsersData =>
          prevUsersData.map(u =>
            u.userId === user.userId ? { ...u, isActive: newIsActive } : u
          )
        );

        // Hiển thị thông báo thành công
        Swal.fire(
          'Thành công!',
          `Trạng thái người dùng đã được cập nhật.`,
          'success'
        );

      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        // Hiển thị thông báo lỗi
        Swal.fire(
          'Thất bại!',
          'Đã xảy ra lỗi khi cập nhật trạng thái người dùng.',
          'error'
        );
      }
    }
  };

  const filteredData = usersData.filter((user) => {
    return (
      (searchName === '' || user.hoTen.toLowerCase().includes(searchName.toLowerCase()))

    );
  });


  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };


  const handleDownloadExtract = async () => {
    try {
      // Hiển thị Swal với trạng thái đang tải
      Swal.fire({
        title: 'Đang tạo file...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Hiển thị icon loading
        },
      });

      // Gọi API với các tham số
      const response = await apiClient.get('/api/export-excel/is-huynh-truong-is-active', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          filename: filename,
        },
        responseType: 'arraybuffer',
      });

      // Tạo Blob từ dữ liệu phản hồi
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);

      // Tạo phần tử liên kết để tải file
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
      document.body.appendChild(a); // Thêm liên kết vào body


      Swal.fire({
        icon: 'success',
        title: 'File đã sẵn sàng để tải xuống!',
        confirmButtonText: 'Tải xuống',
        allowOutsideClick: false, // Không cho phép nhấp ra ngoài để đóng Swal
        allowEscapeKey: false, // Không cho phép dùng phím Escape để thoát Swal
      }).then((result) => {
        if (result.isConfirmed) {
          // Tạo phần tử liên kết để tải file
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
          document.body.appendChild(a); // Thêm liên kết vào body
          a.click(); // Nhấp vào liên kết để kích hoạt tải xuống
          document.body.removeChild(a); // Xóa liên kết khỏi body
          URL.revokeObjectURL(url); // Giải phóng URL đối tượng
        }
      });
    } catch (error) {
      console.error('Lỗi khi tải tệp:', error);
      // Cập nhật Swal khi có lỗi
      Swal.fire({
        icon: 'error',
        title: 'Tải tệp không thành công',
        text: 'Vui lòng thử lại.',
      });
    }
  };
  const headers = [
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Ảnh</label>,
    <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Pháp Danh || Tên</label>,
    <label width={'15%'} className="fixed-width-column d-block w-100 m-0">Vai trò 1</label>,
    <label width={'15%'} className="fixed-width-column d-block w-100 m-0">Vai trò 2</label>,
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Trạng thái</label>,
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Thao tác</label>
  ];
  const headerCells = [
    '',
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
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
      <CTableDataCell>{user.phapDanh} || {user.hoTen}</CTableDataCell>
      <CTableDataCell>{user.roleId1 ? user.roleId1.roleName : 'Chưa có vai trò'}</CTableDataCell>
      <CTableDataCell>{user.roleId2 ? user.roleId2.roleName : 'Chưa có vai trò'}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.isActive)}>
          {user.isActive ? 'Active' : 'Inactive'}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>

        <CDropdown>
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem className="custom-dropdown-item" variant="outline" onClick={() => handleShowModal(user)}>
              Thông tin
            </CDropdownItem>
            <CDropdownItem className="custom-dropdown-item"
              onClick={() => handleToggleStatus(user)}>
              {user.isActive ? 'Tắt Trạng Thái' : 'Bật Trạng Thái'}
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

      </CTableDataCell>
    </>
  );

  return (

    <div className="container-fluid">
      <CategoryCarousel categories={usersData} />
      <br />
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Huynh Trưởng</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton variant="outline" color="info" onClick={handleDownloadExtract} style={{ marginRight: "5px" }}>Excel</CButton>
          <CButton variant="outline" color="info" onClick={handleShowAddModal} >Thêm</CButton>



        </CCol>
      </CRow>

      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        searchCriteria={{ searchName }}
      />


      {selectedUser && (
        <UserModal
          show={showModal}
          handleClose={handleCloseModal}
          user={selectedUser}
          handleChangeHuynhTruong={handleChangeHuynhTruong}
        />
      )}

      {showAddModal && (
        <AddHuynhTruongModal show={showAddModal}
          handleClose={handleCloseAddModal}
          onAddHuynhTruong={handleAddHuynhTruong} />
      )}


    </div>
  )
}

export default DSHuynhTruong
