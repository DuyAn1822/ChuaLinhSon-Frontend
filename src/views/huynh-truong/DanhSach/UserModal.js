import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import {
  CRow, CContainer,
  CCol, CFormSelect,
  CTabs, CTabList,
  CTabContent, CTabPanel,
  CTab,CAvatar
} from '@coreui/react'
import './UserModal.css';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';

function UserModal({ show, handleClose, user, handleChangeHuynhTruong }) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [role1List, setRole1List] = useState([]);
  const [role2List, setRole2List] = useState([]);
  const [bacHocList, setBacHocList] = useState([]);
  const [capList, setCapList] = useState([]);
  const [traiHuanLuyenList, setTraiHuanLuyenList] = useState([]);
  const [taiKhoan, setTaiKhoan] = useState(user.accountDTO !== null ? 'Đã có tài khoản' : 'Chưa có tài khoản');
  const [formData, setFormData] = useState({
    ...user,
    latestRoleId1: user.roleId1 ? user.roleId1.roleId : '',
    latestRoleId2: user.roleId2 ? user.roleId2.roleId : '',
    latestTraiHuanLuyenId: user.lichSuTraiHuanLuyenDTOS && user.lichSuTraiHuanLuyenDTOS.length > 0 ? user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].traiHuanLuyenId : '',
    latestBacHocId: user.lichSuHocs && user.lichSuHocs.length > 0 ? user.lichSuHocs.slice(-1)[0].bacHocId : '',
    latestCapId: user.lichSuCapDTOS && user.lichSuCapDTOS.length > 0 ? user.lichSuCapDTOS.slice(-1)[0].capId : '',
    latestNgayKetThucTraiHuanLuyen: user.lichSuTraiHuanLuyenDTOS && user.lichSuTraiHuanLuyenDTOS.length > 0 ? user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].ngayKetThuc : '',
    latestNgayBatDauTraiHuanLuyen : user.lichSuTraiHuanLuyenDTOS && user.lichSuTraiHuanLuyenDTOS.length > 0 ? user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].ngayBatDau : '',
    latestNgayBatDauBacHoc: user.lichSuHocs && user.lichSuHocs.length > 0 ? user.lichSuHocs.slice(-1)[0].ngayKetThuc : '',
    latestNgayKetThucCap: user.lichSuCapDTOS && user.lichSuCapDTOS.length > 0 ? user.lichSuCapDTOS.slice(-1)[0].ngayBatDau : '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Fetch roles as before
        const response = await apiClient.get(`/api/roles?isHuynhTruong=true`);
        const fetchedRoles = response.data.data;
        const role1List = fetchedRoles.filter((role) => role.doanId !== null);
        const role2List = fetchedRoles.filter((role) => role.doanId === null);

        setRole1List(role1List);
        setRole2List(role2List);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    // Fetch Bac Hoc
    const fetchBacHoc = async () => {
      try {
        const response = await apiClient.get(`/api/bac-hoc`);
        setBacHocList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    const fetchCap = async () => {
      try {
        const response = await apiClient.get(`/api/cap`);
        setCapList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    const fetchTraiHuanLuyen = async () => {
      try {
        const response = await apiClient.get(`/api/trai-huan-luyen`);
    
        if (response.data.status === 'OK') {
          return response.data.data.filter((trai) => trai.isHuynhTruong); // Lọc các trại không phải Huynh Trưởng
        } else {
          console.error('Lỗi khi lấy dữ liệu trại:', response.data.message);
          return []; // Trả về mảng rỗng nếu API trả lỗi
        }
      } catch (error) {
        console.error('Error fetching Trại Huấn Luyện:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
      }
    };
    
    const fetchLichSuTraiHuanLuyen = async () => {
      try {
        const response = await axios.get(`/api/lich-su-trai-huan-luyen/ByUserId/${formData.userId}`);
        console.log('API Response:', response.data);
        if (response.data.status === 'OK') {
          return response.data.data; // Trả về dữ liệu lịch sử
        } else {
          return null; // Trả về null nếu có lỗi
        }
      } catch (error) {
        return null; // Trả về null nếu có lỗi
      }
    };
    
    const fetchAndMapTraiHuanLuyen = async () => {
      try {
        // Gọi đồng thời hai API
        const [allTrai, userTraiHistory] = await Promise.all([
          fetchTraiHuanLuyen(),
          fetchLichSuTraiHuanLuyen(),
        ]);
    
        // Nếu không có lịch sử hoặc lịch sử rỗng, hiển thị tất cả trại
        if (!userTraiHistory || Object.keys(userTraiHistory).length === 0) {
          setTraiHuanLuyenList(allTrai);
          return;
        }
    
        // Mapping dữ liệu
        const mappedTraiList = allTrai.map((trai) => {
          const isCurrent = trai.traiHuanLuyenId === userTraiHistory.traiHuanLuyenId;
          return {
            traiHuanLuyenId: trai.traiHuanLuyenId,
            tenTraiHuanLuyen: trai.tenTraiHuanLuyen,
            ngayBatDau: isCurrent ? userTraiHistory.ngayBatDau : '',
            ngayKetThuc: isCurrent ? userTraiHistory.ngayKetThuc : '',
            isActive: isCurrent ? userTraiHistory.isActive : '',
          };
        });
    
        // Cập nhật danh sách vào state
        setTraiHuanLuyenList(mappedTraiList);
      } catch (error) {
        // Nếu có lỗi, vẫn hiển thị tất cả trại
        const allTraiFallback = await fetchTraiHuanLuyen();
        setTraiHuanLuyenList(allTraiFallback);
      }
    };


    fetchRoles();
    fetchBacHoc();
    fetchCap();
    fetchAndMapTraiHuanLuyen();
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && validExtensions.includes(file.type)) {
      setSelectedFile(file);
    } else {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Chỉ chấp nhận các file ảnh định dạng jpeg, jpg, png.',
        icon: 'error',
      });
      fileInputRef.current.value = ''; // Reset file input if invalid
    }

  };


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [name]: value };
      
      if (name === 'latestBacHocId' && value === '') {
        updatedData.latestBacHocId = '';
        updatedData.latestNgayBatDauBacHoc = '';
      }
      if (name === 'latestCapId' && value === '') {
        updatedData.latestCapId='';
        updatedData.latestNgayKetThucCap='';
      }
      if (name === 'latestTraiHuanLuyenId' && value === '') {
        updatedData.latestTraiHuanLuyenId = '';
        updatedData.latestNgayKetThucTraiHuanLuyen = '';
        updatedData.latestNgayBatDauTraiHuanLuyen = '';
      }
      return updatedData;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gioiTinh: value === 'Male' ? true : false,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.hoTen) {
      newErrors.hoTen = 'Họ và tên là bắt buộc';
      isValid = false;
    } if (!formData.ngaySinh) {
      newErrors.ngaySinh = 'Ngày sinh là bắt buộc';
      isValid = false;
    } if (!formData.latestRoleId1 && !formData.latestRoleId2) {
      newErrors.role = 'Ít nhất một chức vụ phải được chọn';
      isValid = false;
    } if (!formData.sdt) {
      newErrors.sdt = 'Số điện thoại là bắt buộc';
      isValid = false;
    }
    // Bắt buộc chọn "Ngày kết thúc bậc học" nếu đã chọn "Bậc học"
    if (formData.latestBacHocId) {
      if (!formData.latestNgayBatDauBacHoc) {
        newErrors.latestNgayBatDauBacHoc = 'Ngày bắt đầu bậc học là bắt buộc';
        isValid = false;
      }
    }

    // Bắt buộc chọn "Ngày kết thúc cấp" nếu đã chọn "Cấp"
    if (formData.latestCapId) {
      if (!formData.latestNgayKetThucCap) {
        newErrors.ngayKetThucCap = 'Ngày kết thúc cấp là bắt buộc';
        isValid = false;
      }
    }

    if (formData.latestTraiHuanLuyenId) {
      if (!formData.latestNgayBatDauTraiHuanLuyen) {
        newErrors.latestNgayBatDauTraiHuanLuyen = 'Ngày bắt đầu trại huấn luyện là bắt buộc';
        isValid = false;
      }
      if (!formData.latestNgayKetThucTraiHuanLuyen) {
        newErrors.latestNgayKetThucTraiHuanLuyen = 'Ngày kết thúc trại huấn luyện là bắt buộc';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSave = async () => {
    // console.log('Saving user:', formData);
    // return;
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn cập nhật Huynh Trưởng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, cập nhật!',
      cancelButtonText: 'Hủy',
    });

    if (result.isDenied || result.isDismissed) return;

    try {
      // Chuẩn bị dữ liệu cần gửi
      const updateData = {
        userId: formData.userId,
        userIdUx: formData.userIdUx,
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        sdt: formData.sdt,
        phapDanh: formData.phapDanh,
        gioiTinh: formData.gioiTinh,
        createdDate: formData.createdDate, // Giữ nguyên ngày tạo
        updatedDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
        diaChi: formData.diaChi, // Thêm sdtGd nếu cần
        avatar: selectedFile ? selectedFile.name : formData.avatar, // Lấy tên file ảnh
        isHuynhTruong: formData.isHuynhTruong,
        isActive: formData.isActive,
        roleId1: formData.latestRoleId1 ? { roleId: Number(formData.latestRoleId1) } : null,
        roleId2: formData.latestRoleId2 ? { roleId: Number(formData.latestRoleId2) } : null,
        accountDTO: formData.accountDTO,
        nhiemKyDoans: formData.nhiemKyDoans,
        doanSinhDetails: formData.doanSinhDetails,
        lichSuHocs: formData.latestBacHocId !== (formData.lichSuHocs && formData.lichSuHocs.length > 0 ? formData.lichSuHocs.slice(-1)[0].bacHocId : '') && formData.latestBacHocId !== '' ? [
          ...formData.lichSuHocs,
          {
            bacHocId: formData.latestBacHocId,
            userId: formData.userId,
            ngayBatDau: formData.latestNgayBatDauBacHoc,
          },
        ] : null,
        lichSuCapDTOS: formData.latestCapId !== (formData.lichSuCapDTOS && formData.lichSuCapDTOS.length > 0 ? formData.lichSuCapDTOS.slice(-1)[0].capId : '') && formData.latestCapId !== '' ? [
          ...formData.lichSuCapDTOS,
          {
            capId: formData.latestCapId,
            userId: formData.userId,
            ngayKetThuc: formData.latestNgayKetThucCap,
          },
        ] : null,
        lichSuTraiHuanLuyenDTOS: formData.latestTraiHuanLuyenId !== (formData.lichSuTraiHuanLuyenDTOS && 
          formData.lichSuTraiHuanLuyenDTOS.length > 0 ? formData.lichSuTraiHuanLuyenDTOS.slice(-1)[0].ngayKetThuc : '')
           
          && formData.latestTraiHuanLuyenId !== '' ? [
            ...formData.lichSuTraiHuanLuyenDTOS,
            {
              lichSuTraiHuanLuyenId : formData.lichSuTraiHuanLuyenId,
              traiHuanLuyenId: formData.latestTraiHuanLuyenId, // Trại huấn luyện hiện tại
              userId: formData.userId, // userId
              is_active: formData.isActive,
              ngayKetThuc: formData.latestNgayKetThucTraiHuanLuyen, // Ngày kết thúc trại huấn luyện
              ngayBatDau: formData.latestNgayBatDauTraiHuanLuyen 
            },
          ] : null,
        hoTenCha: formData.hoTenCha,
        hoTenMe: formData.hoTenMe,
        sdtCha: formData.sdtCha,
        sdtMe: formData.sdtMe,
        noiSinh: formData.noiSinh,
      };

      // console.log('Update data:', updateData);

      // console.log('Update data:', updateData);
      // return; 
      const response = await apiClient.put(`/api/users/${updateData.userId}`, updateData,);

      if (response.status) {
        // Thông báo thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật thông tin người dùng thành công!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
        handleChangeHuynhTruong();
        handleClose(); // Đóng modal sau khi lưu thành công
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const navigate = useNavigate();

  const handleCreateAccount = () => {
    sessionStorage.setItem('user', JSON.stringify(formData));
    window.location.href = '#/huynh-truong/tai-khoan';
  };

  return (



    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Huynh Trưởng</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <CTabs activeItemKey="thongTin">
          <CTabList variant="tabs">
            <CTab itemKey="thongTin">Thông tin</CTab>
            <CTab itemKey="chucVu">Chức vụ</CTab>
            <CTab itemKey="taiKhoan">Tài khoản</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="p-3" itemKey="thongTin">
              <div className="avatar-container">
       
                <CAvatar size="xl" 
                  src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.avatar || '')}
                  alt="Avatar"
                  className="user-avatar"
                />
                {isEditing && (
                  <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control mt-2" />
                )}
              </div>
              <div className="form-group">

                <label htmlFor="hoTen">Họ Và Tên</label>
                <div className="input-group">
                  <input
                    id="hoTen" name="hoTen" className={`form-control ${errors.hoTen ? 'is-invalid' : ''}`} type="text"
                    value={formData.hoTen || ''} onChange={handleInputChange}
                    readOnly={!isEditing} disabled={!isEditing} required />
                  <span className="input-group-text" id="basic-addon2">{formData.userIdUx || ''}</span>
                  {errors.hoTen && <div className="invalid-feedback">{errors.hoTen}</div>}
                </div>

                <label htmlFor="phapDanh">Pháp Danh</label>
                <input name="phapDanh" className="form-control" type="text"
                  value={formData.phapDanh || ''} onChange={handleInputChange}
                  readOnly={!isEditing} disabled={!isEditing} />

                <label htmlFor="noiSinh">Nơi Sinh</label>
                <div className="input-group">
                  <input
                    id="noiSinh" name="noiSinh" className={`form-control`} type="text"
                    value={formData.noiSinh || ''} onChange={handleInputChange}
                    readOnly={!isEditing} disabled={!isEditing} required />
                </div>

                <label htmlFor="ngaySinh">Ngày Sinh</label>
                <input name="ngaySinh" className={`form-control ${errors.ngaySinh ? 'is-invalid' : ''}`} type="date"
                  value={formData.ngaySinh} onChange={handleInputChange} required
                  readOnly={!isEditing} disabled={!isEditing} />
                {errors.ngaySinh && <div className="invalid-feedback">{errors.ngaySinh}</div>}

                <label htmlFor="createdDate">Ngày Gia Nhập</label>
                <input name="createdDate" className="form-control" type="date"
                  value={formData.createdDate} onChange={handleInputChange}
                  readOnly={!isEditing} disabled={!isEditing} />

                <label htmlFor="sdt">Số Điện Thoại</label>
                <input name="sdt" className={`form-control ${errors.sdt ? 'is-invalid' : ''}`} type="text" value={formData.sdt}
                  onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} required />
                {errors.sdt && <div className="invalid-feedback">{errors.sdt}</div>}

                <label htmlFor="hoTenCha">Họ Tên Cha</label>
                <div className="input-group">
                  <input
                    id="hoTenCha" name="hoTenCha" className={`form-control`} type="text"
                    value={formData.hoTenCha || ''} onChange={handleInputChange}
                    readOnly={!isEditing} disabled={!isEditing} required />
                </div>

                <label htmlFor="sdtCha">Số Điện Thoại Cha</label>
                <input name="sdtCha" className={`form-control ${errors.sdtCha ? 'is-invalid' : ''}`} type="text" value={formData.sdtCha || ""}
                  onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />
                {errors.sdtCha && <div className="invalid-feedback">{errors.sdtCha}</div>}

                <label htmlFor="hoTenMe">Họ Tên Mẹ</label>
                <div className="input-group">
                  <input
                    id="hoTenMe" name="hoTenMe" className={`form-control`} type="text"
                    value={formData.hoTenMe || ''} onChange={handleInputChange}
                    readOnly={!isEditing} disabled={!isEditing} required />
                </div>

                <label htmlFor="sdtMe">Số Điện Thoại Mẹ</label>
                <input name="sdtMe" className={`form-control ${errors.sdtMe ? 'is-invalid' : ''}`} type="text" value={formData.sdtMe || ""}
                  onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />
                {errors.sdtMe && <div className="invalid-feedback">{errors.sdtMe}</div>}

                <label>Giới Tính</label>
                <div className="radio-group">
                  <label className="radio-inline">
                    <input type="radio" name="gioiTinh" value='Male'
                      checked={formData.gioiTinh}
                      onChange={() => handleGenderChange('Male')}
                      disabled={!isEditing} />
                    Nam
                  </label>
                  <label className="radio-inline">
                    <input type="radio" name="gioiTinh" value='Female'
                      checked={!formData.gioiTinh}
                      onChange={() => handleGenderChange('Female')}
                      disabled={!isEditing} />
                    Nữ
                  </label>
                </div>

                <label htmlFor="diaChi">Địa Chỉ</label>
                <textarea name="diaChi" className="form-control" id="exampleFormControlTextarea1" rows="3"
                  value={formData.diaChi} onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}
                ></textarea>

              </div>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="chucVu">
              <div className="form-group">
                <label htmlFor="latestRoleId1 latestRoleId2">Chức Vụ</label>
                <CContainer className="px-1">
                  <CRow>
                    <CCol>
                      <CFormSelect
                        name="latestRoleId1"
                        aria-label="Chức Vụ 1"
                        value={formData.latestRoleId1}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${errors.role ? 'is-invalid' : ''}`}
                      >
                        <option value="">Chọn chức vụ 1</option>
                        {role1List.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol>
                      <CFormSelect
                        name="latestRoleId2"
                        aria-label="Chức Vụ 2"
                        value={formData.latestRoleId2}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${errors.role ? 'is-invalid' : ''}`}
                      >
                        <option value="">Chọn chức vụ 2</option>
                        {role2List.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                </CContainer>

                <label htmlFor="latestBacHocId">Bậc Học</label>
                <CFormSelect
                  name="latestBacHocId"
                  value={formData.latestBacHocId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn bậc học</option>
                  {bacHocList.map((bacHoc) => (
                    <option key={bacHoc.bacHocId} value={bacHoc.bacHocId}>
                      {bacHoc.tenBacHoc}
                    </option>
                  ))}
                </CFormSelect>

                <label htmlFor="latestNgayBatDauBacHoc">Ngày Bắt Đầu Bậc Học</label>
                <input name="latestNgayBatDauBacHoc" className={`form-control ${errors.latestNgayBatDauBacHoc ? 'is-invalid' : ''}`} type="date"
                  value={formData.latestNgayBatDauBacHoc} onChange={handleInputChange}
                  readOnly={!isEditing} disabled={!isEditing || formData.latestBacHocId === '' || formData.latestBacHocId === null} />
                {errors.latestNgayBatDauBacHoc && <div className="invalid-feedback">{errors.latestNgayBatDauBacHoc}</div>}

                <label htmlFor="latestCapId">Cấp</label>
                <CFormSelect
                  name="latestCapId"
                  value={formData.latestCapId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn cấp</option>
                  {capList.map((cap) => (
                    <option key={cap.capId} value={cap.capId}>
                      {cap.capName}
                    </option>
                  ))}
                </CFormSelect>

                <label htmlFor="latestNgayKetThucCap">Ngày Bắt Đầu Cấp</label>
                <input name="latestNgayKetThucCap" className={`form-control ${errors.ngayKetThucCap ? 'is-invalid' : ''}`} type="date"
                  value={formData.latestNgayKetThucCap} onChange={handleInputChange}
                  readOnly={!isEditing} disabled={!isEditing || formData.latestCapId === '' || formData.latestCapId === null} />
                {errors.ngayKetThucCap && <div className="invalid-feedback">{errors.ngayKetThucCap}</div>}


                <label htmlFor="latestTraiHuanLuyenId">Trại Huấn Luyện</label>
                  <CFormSelect
                    name="latestTraiHuanLuyenId" value={formData.latestTraiHuanLuyenId}
                    onChange={handleInputChange} disabled={!isEditing}
                  >
                    <option value="">Chọn trại huấn luyện</option>
                    {traiHuanLuyenList.map((trai) => (
                      <option key={trai.traiHuanLuyenId} value={trai.traiHuanLuyenId}>
                        {trai.tenTraiHuanLuyen}
                      </option>
                    ))}
                  </CFormSelect>

                  <CRow xs={{ gutterX: 5 }}>
                    <CCol>
                      <label htmlFor="latestNgayBatDauTraiHuanLuyen">Ngày Bắt Đầu Trại</label>
                      <input name="latestNgayBatDauTraiHuanLuyen" className={`form-control ${errors.latestNgayBatDauTraiHuanLuyen ? 'is-invalid' : ''}`} type="date"
                        value={formData.latestNgayBatDauTraiHuanLuyen} onChange={handleInputChange}
                        readOnly={!isEditing} disabled={!isEditing || !formData.latestTraiHuanLuyenId}
                      />
                      {errors.latestNgayBatDauTraiHuanLuyen && <div className="invalid-feedback">{errors.latestNgayBatDauTraiHuanLuyen}</div>}
                    </CCol>
                    <CCol>
                      <label htmlFor="latestNgayKetThucTraiHuanLuyen">Ngày Kết Thúc Trại</label>
                      <input name="latestNgayKetThucTraiHuanLuyen" className={`form-control ${errors.latestNgayKetThucTraiHuanLuyen ? 'is-invalid' : ''}`} type="date"
                        value={formData.latestNgayKetThucTraiHuanLuyen} onChange={handleInputChange}
                        readOnly={!isEditing} disabled={!isEditing || !formData.latestTraiHuanLuyenId}
                      />
                       {errors.latestNgayKetThucTraiHuanLuyen && <div className="invalid-feedback">{errors.latestNgayKetThucTraiHuanLuyen}</div>}
                    </CCol>
                    
                  </CRow>


              </div>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="taiKhoan">
              <div className="container text-center">
                <label className="h5 d-block mb-3">{taiKhoan}</label>
                {taiKhoan === 'Chưa có tài khoản' && (
                  <Button disabled={!isEditing}
                    variant="primary"
                    className="mt-3"
                    onClick={handleCreateAccount}
                  >
                    Tạo tài khoản
                  </Button>
                )}
              </div>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
              checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button variant="success" disabled={!isEditing} onClick={handleSave} >
              Save
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
