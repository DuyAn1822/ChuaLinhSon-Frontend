import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ChucVuModal.css';
import env from '../../../env'
import apiClient from '../../../apiClient';

function AddChucVuModal({ show, handleClose, onAddChucVu }) {
  const [name, setName] = useState('');
  const [isHuynhTruong, setIsHuynhTruong] = useState(false);
  const [doanId, setDoanId] = useState(''); // State để lưu id của đoàn
  const [doanList, setDoanList] = useState([]); // State để lưu danh sách đoàn
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Gọi API lấy danh sách đoàn
    const fetchDoanList = async () => {
      try {
        const response = await apiClient.get(`/api/doan`);
        setDoanList(response.data.data);
      } catch (error) {
        console.error('Lỗi khi gọi API lấy danh sách đoàn:', error);
      }
    };

    fetchDoanList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleCheckboxChange = () => {
    setIsHuynhTruong((prevValue) => !prevValue); // Toggle giá trị checkbox
  };

  const handleSelectChange = (e) => {
    setDoanId(e.target.value); // Cập nhật doanId khi người dùng chọn
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Tên Chức Vụ không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    const formData = {
      roleName: name,
      isHuynhTruong,
      doanId,
      isActive: true,
    };

    try {
      const response = await apiClient.post(`/api/roles/insert`, formData);
      const newChucVu = {
        id: response.data.data.ChucVuId,
        name,
        role: isHuynhTruong ? 'Huynh Trưởng' : 'Đoàn Sinh',
        status: true ? 'Active' : 'Inactive',
      };
      onAddChucVu(newChucVu);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm chức vụ thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      setName('');
      setIsHuynhTruong(false);
      setDoanId('');
      handleClose();
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm chức vụ thất bại.',
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thêm Chức Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">Tên Chức Vụ</label>
          <input
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            type="text"
            value={name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isHuynhTruong"
              checked={isHuynhTruong}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="isHuynhTruong" >Huynh Trưởng?
            </label>
          </div>

          {/* Thêm Select để chọn Đoàn */}
          <div className="form-group mt-3">
            <label htmlFor="doanSelect">Chọn Đoàn</label>
            <select
              id="doanSelect"
              className="form-control"
              value={doanId}
              onChange={handleSelectChange}
              required
            >
              <option value=''>-- Chọn Đoàn --</option>
              {doanList.map((doan) => (
                <option key={doan.doanId} value={doan.doanId}>
                  {doan.tenDoan}
                </option>
              ))}
            </select>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddChucVuModal;
