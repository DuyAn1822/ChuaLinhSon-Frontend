import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './BacHocModal.css';
import env from '../../env';
import Swal from 'sweetalert2';
import axios from 'axios';

function BacHocModal({ show, handleClose, bachoc, onReloadTable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: bachoc.name || '',
    role: bachoc.role || '',
    mota: bachoc.mota || '',
  });
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialImageUrl, setInitialImageUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bachoc) {
      setInitialImageUrl(`${env.apiUrl}/api/bac-hoc?bachocId=${bachoc.id}/image`);
    }
  }, [bachoc]);

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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên Bậc Học không được để trống.';
    if (!formData.role.trim()) newErrors.role = 'Cấp Bậc không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn sửa bậc học này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, Sửa',
      cancelButtonText: 'Hủy',
    });

    if (result.isDenied || result.isDismissed) return;

    const BacHocData = {
      tenBacHoc: formData.name, // Mapping the formData to the expected field
      capBac: formData.role,    // Mapping the formData to the expected field
      moTa: formData.mota,      // Mapping the formData to the expected field
    };

    // console.log(BacHocData, bachoc.id)
    try {
      const response = await axios.put(`${env.apiUrl}/api/bac-hoc/${bachoc.id}`, BacHocData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (selectedFile && URL.createObjectURL(selectedFile) !== initialImageUrl) {
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

      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose(); // Close the modal after successful save
      onReloadTable(); // Reload the data table after successful save
      setIsEditing(false); // Disable editing mode
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thất bại.',
        icon: 'error',
      });
    }



    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Bậc Học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : 'path/to/default/avatar.png'}
            alt="Avatar" className="user-avatar"
          />
          {isEditing && (
            <input
              type="file" style={{ display: 'block', marginTop: '10px' }} ref={fileInputRef}
              onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control"
            />)}
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <input id="name" name="name" className="form-control"
            type="text" value={formData.name} onChange={handleInputChange}
            disabled={!isEditing} />

          <label htmlFor="role">Cấp Bậc</label>
          <input name="role" className="form-control"
            type="text" value={formData.role} onChange={handleInputChange}
            disabled={!isEditing} />

          <label htmlFor="mota">Mô Tả</label>
          <textarea name="mota" className="form-control" rows="3"
            value={formData.mota} onChange={handleInputChange}
            disabled={!isEditing}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
            <input className="form-check-input"
              type="checkbox" id="flexSwitchCheckDefault"
              checked={isEditing} onChange={handleEditToggle} />
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

export default BacHocModal;
