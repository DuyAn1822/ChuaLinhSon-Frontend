import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ChucVuModal.css';
import env from '../../../env';
import axios from 'axios';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';

function ChucVuModal({ show, handleClose, ChucVu, onUpdateChucVu }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: ChucVu.name || '',
  });
  const [isHuynhTruong, setIsHuynhTruong] = useState(ChucVu.role === 'Huynh Trưởng' ? true : false);
  const [doanId, setDoanId] = useState(ChucVu.doanId || ''); // Lưu id đoàn
  const [doanList, setDoanList] = useState([]); // Lưu danh sách đoàn

  // Gọi API lấy danh sách đoàn
  useEffect(() => {
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

  const handleCheckboxChange = () => {
    setIsHuynhTruong((prevValue) => !prevValue); // Toggle giá trị checkbox
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    setDoanId(e.target.value); // Cập nhật doanId khi người dùng chọn
  };

  const handleSave = async () => {
    const updatedRole = {
      roleName: formData.name,
      isHuynhTruong: isHuynhTruong, // Set role based on checkbox
      doanId, // Gửi id đoàn cùng với dữ liệu
      isActive: ChucVu.stasus === 'Active' ? true : false,
    };

    try {
      const response = await apiClient.put(`/api/roles/${ChucVu.id}`, updatedRole);

      const updatedData = {
        ...ChucVu,
        name: formData.name,
        role: isHuynhTruong ? 'Huynh Trưởng' : 'Đoàn Sinh',
        doanId,
      };

      onUpdateChucVu(updatedData);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Cập nhật chức vụ thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });

      setIsEditing(false);
      handleClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Cập nhật chức vụ thất bại.');
    }
  };

  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Chức Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <input
            id="name"
            name="name"
            className="form-control"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isHuynhTruong"
              checked={isHuynhTruong}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
            />
            <label className="form-check-label" htmlFor="isHuynhTruong">
              Huynh Trưởng?
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
              disabled={!isEditing}
            >
              <option value="">-- Chọn Đoàn --</option>
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
        <div className="footer-container">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={isEditing}
              onChange={handleEditToggle}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Chỉnh Sửa
            </label>
          </div>
          <div className="footer-buttons">
            <Button variant="success" disabled={!isEditing} onClick={handleSave}>
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

export default ChucVuModal;
