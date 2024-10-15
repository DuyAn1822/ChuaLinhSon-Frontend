import React, { useState,useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../../apiClient';
import Swal from 'sweetalert2';
import './GhiChuModal.css';

function AddGhiChuModal({ show, handleClose, onAddGhiChu  }) {
    const [name, setName] = useState('');
    const [idAccount, setIdAccount] = useState('');
    const [mota, setMota] = useState('');
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === 'name') setName(value);
      if (name === 'mota') setMota(value);
    };

    const handleSave = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn thêm Ghi Chú này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, thêm!',
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

    const formData = {
      noteName: name,
      noteContent: mota,
      accountId: idAccount,
    };

    try {
      // First API call to add Bac Hoc
      const response = await apiClient.post(`/api/notes`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const newGhiChu = {
        id: response.data.data.noteId,
        name,
        mota,
      };
      onAddGhiChu(newGhiChu);
      // console.log(newGhiChu)
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm Ghi Chú thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      // Reset form fields after successful save
      setName('');
      setMota('');
      handleClose();
    } catch (error) {
      // Handle error when adding Bac Hoc
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm Ghi Chú thất bại.',
        icon: 'error',
      });
    }
  };


    return (
        <Modal show={show} scrollable onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title className="modal-title">Thêm Ghi Chú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="form-group">
            <label htmlFor="name">Tên Ghi Chú</label>
            <input id="name" name="name" className="form-control"
            type="text" value={name} onChange={handleInputChange}/> 

            <label htmlFor="mota">Mô Tả</label>
            <textarea name="mota" id="mota" className="form-control"
            rows="5" value={mota} onChange={handleInputChange}
             ></textarea>

            </div>
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

export default AddGhiChuModal;
