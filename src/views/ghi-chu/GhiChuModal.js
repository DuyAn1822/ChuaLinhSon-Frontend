import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './GhiChuModal.css';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../../apiClient';

function GhiChuModal({ show, handleClose, ghiChu, onReloadTable  }) {
  const [formData, setFormData] = useState({
    name: ghiChu.name || '',
    mota: ghiChu.mota || '',
  });
  const [errors, setErrors] = useState({});
  const [idAccount, setIdAccount] = useState('');

  useEffect(() => {
  
  }, [ghiChu]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };


  const handleSave = async () => {


    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn sửa Ghi Chú này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, Sửa',
      cancelButtonText: 'Hủy',
    });

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    const decodedToken = jwtDecode(token);
    const idAccount = decodedToken.account_id;
    setIdAccount(idAccount);
    
    const GhiChuData = {
      noteName: formData.name, // Mapping the formData to the expected field
      noteContent: formData.mota,// Mapping the formData to the expected field
      accountId: idAccount,    
    };
    
    try {
      const response = await apiClient.put(`api/notes/${ghiChu.id}`, GhiChuData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Sửa ghi chú thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose(); // Close the modal after successful save
      onReloadTable(); // Reload the data table after successful save
     // Disable editing mode
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thất bại.',
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Ghi Chú </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">

        </div>

        <div className="form-group">
          <label htmlFor="name">Tên Ghi Chú</label>
          <input id="name" name="name"  className="form-control"
            type="text"  value={formData.name} onChange={handleInputChange}
          />
          <label htmlFor="mota">Mô Tả</label>
          <textarea name="mota" className="form-control" rows="3"
            value={formData.mota} onChange={handleInputChange}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
           
          </div>
          <div className="footer-buttons">
            <Button variant="success" onClick={handleSave}>
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

export default GhiChuModal;
