import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './UserModal.css';
import env from '../../../../env'

function UserModal({ show, handleClose, nhiemKyDoan}) {
  const [user, setUser] = useState(nhiemKyDoan?.pureUser || {});
  const [isEditing, setIsEditing] = useState(false); 
  
  useEffect(() => {
    setUser(nhiemKyDoan?.pureUser || {});
  }, [nhiemKyDoan]);
  
  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Huynh Trưởng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={`${env.userAvatarUrl + nhiemKyDoan.pureUser?.avatar || ''}`} alt="Avatar" className="user-avatar" />
        </div>
        <div className="form-group">
          <label htmlFor="name">Họ Và Tên</label>
          <div className="input-group">
            <input
              id="name" name="name" className="form-control" type="text"
              value={user.hoTen}
              // onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing}/>
            <span className="input-group-text" id="basic-addon2">{user.id}</span>
          </div>

          <label htmlFor="phapdanh">Pháp Danh</label>
          <input name="phapdanh" className="form-control" type="text"
            value={user.phapDanh}
            // onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="phapdanh">Vai Trò</label>
          <input name="phapdanh" className="form-control" type="text"
            value={nhiemKyDoan.role} 
            // onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="email">Email</label>
          <input name="email" className="form-control" type="email"
            value={user.email} 
            // onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="birthDate">Ngày Sinh</label>
          <input name="birthDate" className="form-control" type="date"
            value={user.ngaySinh} 
            // onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="registered">Ngày Kết Thúc Nhiệm Kỳ</label>
          <input name="registered" className="form-control" type="date"
            value={nhiemKyDoan.endDate} 
            // onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="phone">Số Điện Thoại</label>
          <input  name="phone"  className="form-control" type="text" value={user.sdt} 
          // onChange={handleInputChange} 
          readOnly={!isEditing} disabled={!isEditing}/>

          <label>Giới Tính</label>
            <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gender" value="Male"
                checked={user.gioiTinh}
                onChange={() => handleGenderChange(true)}
                disabled={!isEditing} />
              Nam
            </label>
            <label className="radio-inline">
              <input type="radio" name="gender" value="Female"
                checked={!user.gioiTinh} 
                onChange={() => handleGenderChange(false)}
                disabled={!isEditing} />
              Nữ
            </label>
            </div>
          <label htmlFor="address">Địa Chỉ</label>
          <textarea name="address" className="form-control" id="exampleFormControlTextarea1" rows="3"
            value={user.diaChi} 
            // onChange={handleInputChange} 
            readOnly={!isEditing} disabled={!isEditing}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">    
          </div>
          <div className="footer-buttons">      
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
