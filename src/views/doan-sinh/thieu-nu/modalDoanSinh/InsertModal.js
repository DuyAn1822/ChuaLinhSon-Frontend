import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  CRow, CContainer,
  CCol, CFormSelect,
  CTabs, CTabList,
  CTabContent, CTabPanel,
  CTab
} from '@coreui/react'
// import './UserModal.css';
import Swal from 'sweetalert2';
import apiClient from '../../../../apiClient';

function InsertModal({ show, handleClose, onAddDoanSinh }) {
  const [name, setName] = useState('');
  const [role1, setRole1] = useState('');
  const [role2, setRole2] = useState('');
  const [phapdanh, setPhapdanh] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registered, setRegistered] = useState('');
  const [noiSinh, setNoiSinh] = useState('');
  const [phone, setPhone] = useState('');
  const [hoTenCha, sethoTenCha] = useState('');
  const [sdtCha, setSdtCha] = useState('');
  const [hoTenMe, sethoTenMe] = useState('');
  const [sdtMe, setSdtMe] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [rolesWithDoanId, setRolesWithDoanId] = useState([]);
  const [rolesWithoutDoanId, setRolesWithoutDoanId] = useState([]);
  const fileInputRef = useRef(null);
  const [bacHoc, setBacHoc] = useState(0);
  const [bacHocList, setBacHocList] = useState([]);
  const [ngayKetThucBacHoc, setNgayKetThucBacHoc] = useState('');
  const [capList, setCapList] = useState([]);
  const [capId, setCapId] = useState(0);
  const [ngayKetThucCap, setNgayKetThucCap] = useState('');
  const [traiHuanLuyenList, setTraiHuanLuyenList] = useState([]);
  const [traiHuanLuyenId, setTraiHuanLuyenId] = useState(0);
  const [ngayKetThucTraiHuanLuyen, setNgayKetThucTraiHuanLuyen] = useState('');
  const [activeItemKey, setActiveItemKey] = useState('thongTin');

  useEffect(() => {
    setRegistered(new Date().toISOString().split('T')[0]);
    const fetchRoles = async () => {
      try {
        // Fetch roles as before
        const response = await apiClient.get(`/api/roles/get-all`);
        if (response.data.status === 'OK') {
          const fetchedRoles = response.data.data.filter(
            (role) => !role.isHuynhTruong && role.doanId === 4
          );
          setRolesWithDoanId(fetchedRoles);
          // console.log(fetchedRoles);
        } else {
          console.error('Lỗi khi lấy dữ liệu roles:', rolesResponse.data.message);
        }
        // const fetchedRoles = response.data.data;
        // const role1List = fetchedRoles.filter((role) => role.doanId !== null);
        // const role2List = fetchedRoles.filter((role) => role.doanId === null);

        // setRole1List(role1List);
        // setRole2List(role2List);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    // Fetch Bac Hoc
    const fetchBacHoc = async () => {
      try {
        const response = await apiClient.get(`/api/bac-hoc`);

        if (response.data.status === 'OK') {
          const filteredBacHoc = response.data.data.filter(
            (bac) => bac.capBac === "Đoàn Sinh"
          );
          setBacHocList(filteredBacHoc);
        } else {
          console.error('Lỗi khi lấy dữ liệu Bậc Học:', response.data.message);
        }

        // setBacHocList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    // const fetchCap = async () => {
    //   try {
    //     const response = await apiClient.get(`/api/cap`);
    //     setCapList(response.data.data);
    //   } catch (error) {
    //     console.error('Error fetching Bac Hoc:', error);
    //   }
    // };

    const fetchTraiHuanLuyen = async () => {
      try {
        const response = await apiClient.get(`/api/trai-huan-luyen`);

        if (response.data.status === 'OK') {
          const filteredTrai = response.data.data.filter(
            (trai) => !trai.isHuynhTruong
          );
          setTraiHuanLuyenList(filteredTrai);
        } else {
          console.error('Lỗi khi lấy dữ liệu trại:', response.data.message);
        }
        // setTraiHuanLuyenList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };
    fetchRoles();
    fetchBacHoc();
    // fetchCap();
    fetchTraiHuanLuyen();
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length === 1 && errors.role) {
      setActiveItemKey('chucVu');
      document.getElementById('tabChucVu').click();
    } else {
      setActiveItemKey('thongTin');
    }
  }, [errors]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'role1':
        setRole1(value);
        break;
      case 'role2':
        setRole2(value);
        break;
      case 'phapdanh':
        setPhapdanh(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'birthDate':
        setBirthDate(value);
        break;
      case 'noiSinh':
        setNoiSinh(value);
        break;
      case 'registered':
        setRegistered(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'hoTenCha':
        sethoTenCha(value);
        break;
      case 'hoTenMe':
        sethoTenMe(value);
        break;
      case 'sdtCha':
        setSdtCha(value);
        break;
      case 'sdtMe':
        setSdtMe(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'bacHoc':
        setBacHoc(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'cap':
        setCapId(value);
        break;
      case 'traiHuanLuyen':
        setTraiHuanLuyenId(value);
        break;
      case 'ngayKetThucBacHoc':
        setNgayKetThucBacHoc(value);
        break;
      case 'ngayKetThucCap':
        setNgayKetThucCap(value);
        break;
      case 'ngayKetThucTraiHuanLuyen':
        setNgayKetThucTraiHuanLuyen(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Họ và tên là bắt buộc';
      isValid = false;
    } if (!birthDate) {
      newErrors.birthDate = 'Ngày sinh là bắt buộc';
      isValid = false;
    } if (!role1 && !role2) {
      newErrors.role = 'Ít nhất một chức vụ phải được chọn';
      isValid = false;
    } if (!phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      isValid = false;
    }
    if (!gender) {
      newErrors.gender = 'Giới tính là bắt buộc';
      isValid = false;
    }
    // Bắt buộc chọn "Ngày kết thúc bậc học" nếu đã chọn "Bậc học"
    if (bacHoc) {
      if (!ngayKetThucBacHoc) {
        newErrors.ngayKetThucBacHoc = 'Ngày kết thúc bậc học là bắt buộc';
        isValid = false;
      }
    }

    // Bắt buộc chọn "Ngày kết thúc cấp" nếu đã chọn "Cấp"
    if (capId) {
      if (!ngayKetThucCap) {
        newErrors.ngayKetThucCap = 'Ngày kết thúc cấp là bắt buộc';
        isValid = false;
      }
    }

    if (traiHuanLuyenId) {
      if (!ngayKetThucTraiHuanLuyen) {
        newErrors.ngayKetThucTraiHuanLuyen = 'Ngày kết thúc trại huấn luyện là bắt buộc';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn thêm Đoàn Sinh này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, thêm!',
      cancelButtonText: 'Hủy',
    });

    if (result.isDenied || result.isDismissed) return;


    const formData = {
      hoTen: name,
      ngaySinh: birthDate,
      sdt: phone,
      noiSinh: noiSinh,
      hoTenCha: hoTenCha,
      hoTenMe: hoTenMe,
      sdtCha: sdtCha,
      sdtMe: sdtMe,
      email: email,
      phapDanh: phapdanh,
      gioiTinh: gender === 'Male', // true for Male, false for Female
      createdDate: registered,
      isHuynhTruong: false,
      updatedDate: new Date().toISOString().split('T')[0], // Current date as string
      diaChi: address,
      isActive: true,
      roleId1: role1 ? { roleId: role1 } : null, // Assume role1 comes from a select input
      // roleId2: role2 ? { roleId: role2 } : null, // Assume role2 comes from a select input
      lichSuHocs: bacHoc ? [{
        bacHocId: Number(bacHoc),
        ngayKetThuc: ngayKetThucBacHoc
      }] : null, // Assume bacHoc comes from a select input 
      // lichSuCapDTOS: capId ? [{
      //   capId: Number(capId),
      //   ngayKetThuc: ngayKetThucCap
      // }] : null, // Assume capId comes from a select input
      accountDTO: null,
      lichSuTraiHuanLuyenDTOS: traiHuanLuyenId ? [{
        traiHuanLuyenId: Number(traiHuanLuyenId),
        ngayKetThuc: ngayKetThucTraiHuanLuyen
      }] : null, // Assume traiHuanLuyenId comes from a select input
    };


    // console.log(formData)
    // return;

    try {
      // First API call to add Bac Hoc
      const response = await apiClient.post(`/api/users/create-user`, formData);
      // console.log(response.data.data);
      let data = response.data.data;
      if (selectedFile) {
        try {
          const fileFormData = new FormData();
          fileFormData.append('file', selectedFile);
          const userId = response.data.data.userId
          // console.log(userId);

          // Second API call to upload the file
          await apiClient.post(`/api/files/images/upload?userId=${userId}`, fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (fileUploadError) {
          console.error('Lỗi khi upload file:', fileUploadError);
          Swal.fire({
            title: 'Thông báo từ hệ thống!',
            text: 'Thêm Đoàn Sinh thất bại do lỗi upload file.',
            icon: 'error',
          });

          return;
        }
      }


      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm Đoàn Sinh Thành Công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      onAddDoanSinh();

      setName('');
      setRole1('');
      setRole2('');
      setPhapdanh('');
      setEmail('');
      setBirthDate('');
      setRegistered('');
      setPhone('');
      sethoTenCha('');
      sethoTenMe('');
      setSdtCha('');
      setSdtMe('');
      setAddress('');
      setGender('Male');
      setSelectedFile(null);
      setErrors({});
      setRolesWithDoanId([]);
      setRolesWithoutDoanId([]);
      fileInputRef.current.value = null;
      setBacHoc(0);
      setBacHocList([]);
      setNgayKetThucBacHoc('');
      setCapList([]);
      setCapId(0);
      setNgayKetThucCap('');
      setTraiHuanLuyenList([]);
      setTraiHuanLuyenId(0);
      setNgayKetThucTraiHuanLuyen('');
      setNoiSinh('');
      setActiveItemKey('thongTin');
      handleClose();
    } catch (error) {
      // console.log(error);
      // Handle error when adding Bac Hoc
      // const errorMessage = error.response?.data?.message || 'Thêm thất bại 111111.';
      if (error) {
        Swal.fire({
          title: 'Thông báo từ hệ thống!',
          text: 'Thêm Đoàn Sinh Lỗi',
          icon: 'error',
        });
      }
    }
  };

  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Đoàn Sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <CTabs activeItemKey={activeItemKey}>
          <CTabList variant="tabs">
            <CTab itemKey="thongTin">Thông tin</CTab>
            <CTab itemKey="chucVu" id='tabChucVu'>Chức vụ</CTab>
          </CTabList>

          <CTabContent>

            <CTabPanel className={`p-3`} itemKey="thongTin">

              <div className="avatar-container">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : 'path/to/default/avatar.png'}
                  alt="Avatar" className="user-avatar"
                />
                <input
                  type="file" style={{ display: 'block', marginTop: '10px' }} ref={fileInputRef}
                  onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control"
                />
              </div>

              <div className="form-group">

                <label htmlFor="name">Họ Và Tên</label>
                <div className="input-group">
                  <input
                    id="name" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    type="text" value={name} onChange={handleInputChange} required />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <label htmlFor="phapdanh">Pháp Danh</label>
                <input
                  name="phapdanh" className="form-control"
                  type="text" value={phapdanh}
                  onChange={handleInputChange}
                />

                <label htmlFor="email">Email</label>
                <input
                  name="email" className="form-control"
                  type="email" value={email}
                  onChange={handleInputChange}
                />

                <label htmlFor="noiSinh">Nơi Sinh</label>
                <input
                  name="noiSinh" className="form-control"
                  type="noiSinh" value={noiSinh}
                  onChange={handleInputChange}
                />

                <label htmlFor="birthDate">Ngày Sinh</label>
                <input
                  id="birthDate" name="birthDate" className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  type="date" value={birthDate} onChange={handleInputChange} required
                />
                {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}

                <label htmlFor="registered">Ngày Gia Nhập</label>
                <input
                  name="registered" className="form-control"
                  type="date" value={registered}
                  onChange={handleInputChange}
                />

                <label htmlFor="phone">Số Điện Thoại</label>
                <input
                  id="phone" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  type="text" value={phone} onChange={handleInputChange} required
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

                <label htmlFor="hoTenCha">Họ Và Tên Cha</label>
                <div className="input-group">
                  <input
                    id="hoTenCha" name="hoTenCha" className={`form-control`}
                    type="text" value={hoTenCha} onChange={handleInputChange} required />
                </div>

                <label htmlFor="sdtCha">Số Điện Thoại Cha</label>
                <input
                  id="sdtCha" name="sdtCha" className={`form-control ${errors.sdtCha ? 'is-invalid' : ''}`}
                  type="text" value={sdtCha} onChange={handleInputChange} required
                />
                {errors.sdtCha && <div className="invalid-feedback">{errors.sdtCha}</div>}

                <label htmlFor="hoTenMe">Họ Và Tên Cha</label>
                <div className="input-group">
                  <input
                    id="hoTenMe" name="hoTenMe" className={`form-control`}
                    type="text" value={hoTenMe} onChange={handleInputChange} required />
                </div>

                <label htmlFor="sdtMe">Số Điện Thoại Mẹ</label>
                <input
                  id="sdtMe" name="sdtMe" className={`form-control ${errors.sdtMe ? 'is-invalid' : ''}`}
                  type="text" value={sdtMe} onChange={handleInputChange} required
                />
                {errors.sdtMe && <div className="invalid-feedback">{errors.sdtMe}</div>}

                <label>Giới Tính</label>
                <div className="radio-group">
                  <label className="radio-inline">
                    <input type="radio" name="gender"
                      value="Male" checked={gender === 'Male'}
                      onChange={handleInputChange} required
                    />
                    Nam
                  </label>
                  <label className="radio-inline">
                    <input
                      type="radio" name="gender"
                      value="Female" checked={gender === 'Female'}
                      onChange={handleInputChange} required
                    />
                    Nữ
                  </label>
                </div>
                {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}

                <label htmlFor="address">Địa Chỉ</label>
                <textarea
                  name="address" className="form-control"
                  rows="3" value={address} onChange={handleInputChange}
                ></textarea>

              </div>

            </CTabPanel>

            <CTabPanel className={`p-3`} itemKey="chucVu">

              <div className="form-group">

                <label htmlFor="role">Chức Vụ</label>
                <CContainer className="px-1">
                  <CRow>
                    <CCol>
                      <CFormSelect
                        name="role1" aria-label="Chức Vụ 1"
                        value={role1} onChange={handleInputChange}
                        className={`${errors.role ? 'is-invalid' : ''}`}
                      >
                        <option value="">Chọn chức vụ 1</option>
                        {rolesWithDoanId.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>

                  </CRow>
                  {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                </CContainer>

                <label htmlFor="bacHoc">Bậc Học</label>
                <CFormSelect
                  name="bacHoc"
                  aria-label="Chọn bậc học"
                  value={bacHoc} // Correctly assign the state value here
                  onChange={handleInputChange} // Handle change correctly
                >
                  <option value="">Chọn bậc học</option>
                  {bacHocList.map((bacHoc) => (
                    <option key={bacHoc.bacHocId} value={bacHoc.bacHocId}>
                      {bacHoc.tenBacHoc}
                    </option>
                  ))}
                </CFormSelect>

                <label htmlFor="ngayKetThucBacHoc">Ngày Kết Thúc Bậc Học</label>
                <input
                  id="ngayKetThucBacHoc" name="ngayKetThucBacHoc" className={`form-control ${errors.ngayKetThucBacHoc ? 'is-invalid' : ''}`}
                  type="date" value={ngayKetThucBacHoc} onChange={handleInputChange} required disabled={bacHoc === 0 || bacHoc === ""}

                />
                {errors.ngayKetThucBacHoc && <div className="invalid-feedback">{errors.ngayKetThucBacHoc}</div>}

                <label htmlFor="traiHuanLuyen">Trại Huấn Luyện</label>
                <CFormSelect
                  name="traiHuanLuyen"
                  aria-label="Chọn trại huấn luyện"
                  value={traiHuanLuyenId} // Correctly assign the state value here
                  onChange={handleInputChange} // Handle change correctly
                >
                  <option value="">Chọn trại huấn luyện</option>
                  {traiHuanLuyenList.map((trai) => (
                    <option key={trai.traiHuanLuyenId} value={trai.traiHuanLuyenId}>
                      {trai.tenTraiHuanLuyen}
                    </option>
                  ))}
                </CFormSelect>

                <label htmlFor="ngayKetThucTraiHuanLuyen">Ngày Kết Thúc Cấp</label>
                <input
                  id="ngayKetThucTraiHuanLuyen" name="ngayKetThucTraiHuanLuyen" className={`form-control ${errors.ngayKetThucTraiHuanLuyen ? 'is-invalid' : ''}`}
                  type="date" value={ngayKetThucTraiHuanLuyen} onChange={handleInputChange} required disabled={traiHuanLuyenId === 0 || traiHuanLuyenId === ""}
                />
                {errors.ngayKetThucTraiHuanLuyen && <div className="invalid-feedback">{errors.ngayKetThucTraiHuanLuyen}</div>}

              </div>

            </CTabPanel>

          </CTabContent>

        </CTabs>

      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">

          </div>
          <div className="footer-buttons">
            <Button variant="success" onClick={handleSave} >
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

export default InsertModal;
