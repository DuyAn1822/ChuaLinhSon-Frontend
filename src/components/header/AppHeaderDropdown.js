
import {
  cilLockLocked,
  cilSettings,
  cilUser
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormCheck,
  CFormLabel
} from '@coreui/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import Swal from "sweetalert2";
import apiClient from '../../apiClient';
import env from '../../env';
import ChangePass from './ChangePassword';
import './AppHeaderDropdown.css'



const logout = async () => {
  Swal.fire({
    icon: 'question',
    title: 'Bạn có muốn đăng xuất khỏi phần mềm?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đăng xuất',
    cancelButtonText: 'Hủy'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiClient.post(`/api/auth/logout`);
      } catch (error) {
        console.error(error);
      } finally {
        Swal.fire({
          icon: 'success',
          title: 'Đăng xuất thành công!'
        }).then(() => {
          clearLocalStorage();
          const event = new Event('storage');
          window.dispatchEvent(event);
          window.location.href = '/#login';
        });
      }
    }
  })
}

const clearLocalStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
}

const AppHeaderDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [iduser, setIdUser] = useState('');
  // const [iduserlog, setIdUserlog] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null)
  const [changePassModalVisible, setChangePassModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setIdUser(userId);
        const response = await apiClient.get(`/api/files/images/${userId}`);
        if (response.status === 200) {
          const newImageUrl = response.data.data;
          setImageUrl(newImageUrl);
        } else {
          console.error('Failed to fetch image URL, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProfileClick = async () => {
    setModalVisible(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      setIdUser(userId);
      const response = await apiClient.get(`/api/users/doan-sinh-detail`, {
        params: { userId: userId }
      });
      if (response.status === 200) {
        setUserProfile(response.data.data);
      } else {
        console.error('Failed to load profile, status:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while fetching profile:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleChangePassClick = () => {
    setChangePassModalVisible(true); // Mở modal đổi mật khẩu
  }

  const handleCloseChangePassModal = () => {
    setChangePassModalVisible(false); // Đóng modal đổi mật khẩu
  }

  // Hàm để bật/tắt chế độ chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Hàm để lưu thông tin (có thể tích hợp API tại đây)
  const handleSave = async () => {
    // Logic lưu thông tin đã chỉnh sửa
    try {
      // Dữ liệu cập nhật từ userProfile hoặc các trường khác
      const updatedData = {
        ...userProfile[0],
        hoTen: userProfile[0].hoTen,
        phapDanh: userProfile[0].phapDanh,
        gioiTinh: userProfile[0].gioiTinh,
        email: userProfile[0].email,
        sdt: userProfile[0].sdt,
        diaChi: userProfile[0].diaChi
      };

      // Gọi API PUT để cập nhật thông tin user
      const response = await apiClient.put(`/api/users/${userProfile[0].userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Swal.fire({
        title: "Thành công.",
        text: "Đổi thông tin thành công.",
        icon: "success"
      });
    } catch (error) {
      console.error("Lỗi cập nhật", error);
      Swal.fire({
        title: "Thành công.",
        text: "Đổi thông tin không thành công.",
        icon: "error"
    });
    }
    // Sau khi lưu, tắt chế độ chỉnh sửa
    setIsEditing(false);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {

      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

      // Kiểm tra định dạng file
      if (!validExtensions.includes(file.type)) {
        Swal.fire({
          title: "Thông báo từ hệ thống!",
          text: "Đây không phải file ảnh, vui lòng chọn lai.",
          icon: "warning"
        });
        return; // Dừng nếu định dạng không hợp lệ
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const tempImageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho hình ảnh

        axios.post(`${env.apiUrl}/api/files/images/upload?userId=${iduser}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Thêm Authorization header
          }
        })
          .then(() => {
            let timerInterval;
            return Swal.fire({
              title: "Thông báo từ hệ thống!",
              html: "Đang cập nhật hình ảnh<b></b>s",
              timer: 2500,
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            });
          })
          .then(async (result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              URL.revokeObjectURL(tempImageUrl);
              const token = localStorage.getItem('token');
              if (!token) {
                console.error('Token not found');
                return;
              }
              const decodedToken = jwtDecode(token);
              const userId = decodedToken.user_id;
              setIdUser(userId);
              try {
                const response = await apiClient.get(`/api/files/images/${userId}`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });

                if (response.status === 200) {
                  const newImageUrl = response.data.data;
                  setImageUrl(newImageUrl);

                  await Swal.fire({
                    title: "Thông báo từ hệ thống!",
                    text: "Cập nhật ảnh thành công",
                    icon: "success"
                  });
                } else {
                  console.error('Failed to fetch new image URL, status:', response.status);
                  await Swal.fire({
                    title: "Thông báo từ hệ thống!",
                    text: "Cập nhật ảnh không thành công.",
                    icon: "error"
                  });
                }
              } catch (error) {
                console.error('Error fetching new image URL:', error);
                await Swal.fire({
                  title: "Thông báo từ hệ thống!",
                  text: "Đã xảy ra lỗi khi lấy ảnh.",
                  icon: "error"
                });
              }
            }
          })
          .catch(error => {
            console.error('Error during image upload:', error);
            Swal.fire({
              title: "Thông báo từ hệ thống!",
              text: "Cập nhật ảnh thất bại.",
              icon: "error"
            });
          });

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  return (

    <>
      <ChangePass modalVisible={changePassModalVisible} onCloseModal={handleCloseChangePassModal} />

      <div>

        <CDropdown variant="nav-item">
          <CDropdownToggle placement="bottom-end" className="py-1" caret={false}>
            <div className="avatar">
              <img className="avatar-img" src={`${imageUrl}`} style={{ width: '50px', height: '35px', borderRadius: '50%', cursor: 'pointer' }} />
            </div>
          </CDropdownToggle>
          <CDropdownMenu className="pt-0" placement="bottom-end">
            <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Tài khoản</CDropdownHeader>
            <CDropdownItem href="#" onClick={handleProfileClick}>
              <CIcon icon={cilUser} className="me-2" />
              Hồ sơ của bạn
            </CDropdownItem>
            <CDropdownItem href="#" onClick={handleChangePassClick}>
              <CIcon icon={cilSettings} className="me-2" />
              Đổi mật khẩu
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem href="#" onClick={logout}>
              <CIcon icon={cilLockLocked} className="me-2" />
              Đăng xuất
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        <CModal visible={modalVisible} scrollable onClose={handleCloseModal}>
          <CModalHeader>
            <CModalTitle>Hồ sơ người dùng</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {userProfile ? (
              <>
                <div className="text-center mb-3">
                  <img
                    src={imageUrl || 'http://103.15.222.65/images/999.jpg'} alt="User Avatar"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
                    onClick={handleAvatarClick}
                  />
                  <CFormInput
                    type="file"
                    className="mb-3"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                  />
                </div>

                <CFormInput
                  type="text"
                  label="Họ tên"
                  value={userProfile[0].hoTen || "Chưa có thông tin."}
                  disabled={!isEditing}
                  className="mb-3"
                  onChange={e => setUserProfile([{ ...userProfile[0], hoTen: e.target.value }])}
                />
                <CFormInput
                  type="text"
                  label="Pháp Danh"
                  value={userProfile[0].phapDanh || "Chưa có thông tin."}
                  disabled={!isEditing}
                  className="mb-3"
                  onChange={e => setUserProfile([{ ...userProfile[0], phapDanh: e.target.value }])}
                />
                <CFormLabel>Giới tính</CFormLabel>
                <div className="mb-3">
                  <div className=" form-check-inline">
                    <CFormCheck
                      type="radio"
                      id="genderMale"
                      name="gender"
                      label="Nam"
                      checked={userProfile[0].gioiTinh === true}
                      disabled={!isEditing}
                      onChange={() => setUserProfile([{ ...userProfile[0], gioiTinh: true }])}
                    />
                  </div>
                  <div className=" form-check-inline">
                    <CFormCheck
                      type="radio"
                      id="genderFemale"
                      name="gender"
                      label="Nữ"
                      checked={userProfile[0].gioiTinh === false}
                      disabled={!isEditing}
                      onChange={() => setUserProfile([{ ...userProfile[0], gioiTinh: false }])}
                    />
                  </div>
                </div>
                <CFormInput
                  type="email"
                  label="Email"
                  value={userProfile[0].email || "Chưa có thông tin."}
                  disabled={!isEditing}
                  className="mb-3"
                  onChange={e => setUserProfile([{ ...userProfile[0], email: e.target.value }])}
                />
                <CFormInput
                  type="tel"
                  label="Số điện thoại"
                  value={userProfile[0].sdt || "Chưa có thông tin."}
                  disabled={!isEditing}
                  className="mb-3"
                  onChange={e => setUserProfile([{ ...userProfile[0], sdt: e.target.value }])}
                />
                <CFormInput
                  type="text"
                  label="Địa chỉ"
                  value={userProfile[0].diaChi || "Chưa có thông tin."}
                  disabled={!isEditing}
                  className="mb-3"
                  onChange={e => setUserProfile([{ ...userProfile[0], diaChi: e.target.value }])}
                />
              </>
            ) : (
              <p>Loading...</p>
            )}
          </CModalBody>

          <CModalFooter>
            <CButton className="editBtn" onClick={handleEditClick}>
              <svg height="1em" viewBox="0 0 512 512">
                <path
                  d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                ></path>
              </svg>
            </CButton>
            <CButton color="primary" onClick={handleSave} disabled={!isEditing}>
              Lưu
            </CButton>
            <CButton color="outline-secondary" onClick={handleCloseModal}>
              Đóng
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </>
  )

}

export default AppHeaderDropdown
