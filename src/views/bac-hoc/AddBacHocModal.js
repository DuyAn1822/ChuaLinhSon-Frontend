import React, { useState,useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './BacHocModal.css';
import env from '../../env';

function AddBacHocModal({ show, handleClose, onAddBacHoc  }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [mota, setMota] = useState('');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
        if (name === 'name') setName(value);
        if (name === 'role') setRole(value);
        if (name === 'mota') setMota(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Tên Bậc Học không được để trống.';
        if (!role.trim()) newErrors.role = 'Cấp Bậc không được để trống.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }; 

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

const handleSave = async () => {
  if (!validateForm()) return;

  const result = await Swal.fire({
    title: 'Xác nhận!',
    text: 'Bạn có chắc chắn muốn thêm bậc học này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có, thêm!',
    cancelButtonText: 'Hủy',
  });

  if (result.isDenied || result.isDismissed) return;

  const formData = {
    tenBacHoc: name,
    capBac: role,
    moTa: mota,
  };

  try {
    // First API call to add Bac Hoc
    const response = await axios.post(`${env.apiUrl}/api/bac-hoc`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (selectedFile) {
      try {
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);
        const idBacHoc = response.data.data.bacHocId
        // Second API call to upload the file
        await axios.post(`${env.apiUrl}/api/bac-hoc/upload-img?bacHocId=${idBacHoc}`, fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (fileUploadError) {
        console.error('Lỗi khi upload file:', fileUploadError);
        Swal.fire({
          title: 'Thông báo từ hệ thống!',
          text: 'Thêm bậc học thất bại do lỗi upload file.',
          icon: 'error',
        });

        return;
      }
    }

    // Only proceed if both actions succeed
    const newBacHoc = {
      id: response.data.data.bacHocId,
      name,
      role,
      mota,
    };
    onAddBacHoc(newBacHoc);
    Swal.fire({
      title: 'Thông báo từ hệ thống!',
      text: 'Thêm bậc học thành công!',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
    });
    // Reset form fields after successful save
    setName('');
    setRole('');
    setMota('');
    setSelectedFile(null);
    // Close modal
    handleClose();
  } catch (error) {
    // Handle error when adding Bac Hoc
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
            <Modal.Title className="modal-title">Thêm Bậc Học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            <label htmlFor="name">Tên Bậc Học</label>
            <input id="name" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            type="text" value={name} onChange={handleInputChange} required/>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}   

            <label htmlFor="role">Cấp Bậc</label>
            <input name="role" className={`form-control ${errors.role ? 'is-invalid' : ''}`} type="text"
            value={role} onChange={handleInputChange} required/>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            
            <label htmlFor="mota">Mô Tả</label>
            <textarea name="mota" className="form-control"
            rows="3" value={mota} onChange={handleInputChange}
            required ></textarea>

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

export default AddBacHocModal;
