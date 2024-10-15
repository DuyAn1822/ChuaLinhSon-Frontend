import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { TreeSelect } from 'primereact/treeselect';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';
import { useScreens } from '../../../AuthorizationContext';
import env from '../../../env';
import './MultiSelectScreen.css';
import './UserModal.css';

function UserModal({ show, handleClose, user, setUpdated }) {

  const { screens } = useScreens();
  const [isEditing, setIsEditing] = useState(false);
  const [nodes, setNodes] = useState(null);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  const [formData, setFormData] = useState({
    username: user.accountDTO?.username,
    password: user.accountDTO?.password,
    userId: user.userId
  });

  useEffect(() => {
    apiClient.get(`/api/screens/get-all-tree-nodes`)
      .then(response => setNodes(response.data.data))
      .catch(error => console.error(error));
  }, [])

  useEffect(() => {
    handleUserDataChanged();
  }, [user]);

  const handleUserDataChanged = () => {
    let tempSelectedNodeKeys = {};
    user?.accountDTO?.screenIds?.forEach(element => {
      screens.forEach(ele => {
        if (ele.screenId?.startsWith(element.screenId)) {
          tempSelectedNodeKeys = {
            ...tempSelectedNodeKeys,
            [ele.screenId]: {
              checked: true,
              partialChecked: false
            }
          }
        } else if (element.screenId?.startsWith(ele.screenId)) {
          tempSelectedNodeKeys = {
            ...tempSelectedNodeKeys,
            [ele.screenId]: {
              checked: false,
              partialChecked: true
            }
          }
        }
      })
    });
    setSelectedNodeKeys(tempSelectedNodeKeys);
    setFormData({
      password: user?.password,
      userId: user.userId
    });
  }

  const getOptimizedSelectedNodes = () => {
    if (!selectedNodeKeys) return [];
    let partialCheckeds = [];
    let keys = Object.keys(selectedNodeKeys);
    for (let key of keys) {
      let keyObj = selectedNodeKeys[key];
      if (key === '*' && keyObj.checked) return ['*'];
      if (!keyObj.checked && keyObj.partialChecked) {
        partialCheckeds.push(key);
      }
    }
    return keys?.map(key => {
      if (selectedNodeKeys[key].checked
        && partialCheckeds.some(element => key.startsWith(element)
          && key.split('.').length - 1 === element.split('.').length))
        return key;
    }).filter(Boolean);
  }

  const convertSelectedScreensToListScreens = () => {
    return getOptimizedSelectedNodes()?.map(key => {
      return {
        accountId: user?.accountDTO?.accountId,
        screenId: key
      }
    });
  }

  const getAccountPayload = () => {
    return {
      ...formData,
      screenIds: convertSelectedScreensToListScreens()
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSave = () => {
    setIsEditing(false);
    const payload = getAccountPayload();
    Swal.fire({
      icon: 'question',
      title: 'Bạn có đồng ý cập nhật?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = user.accountDTO
            ? await apiClient.put(`/api/accounts/${user.accountDTO.accountId}`, payload)
            : await apiClient.post(`/api/accounts`, {
              ...payload,
              isActive: true
            });
          let timerInterval;
          Swal.fire({
            title: "Vui lòng đợi xử lý thông tin!",
            // html: "Tự động đóng sau <b></b> mili giây.",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
              // const timer = Swal.getPopup().querySelector("b");
              // timerInterval = setInterval(() => {
              //   timer.textContent = `${Swal.getTimerLeft()}`;
              // }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then(() => {
            setUpdated(response.data.data);
            Swal.fire({
              icon: 'success',
              title: 'Cập nhật thành công!'
            }).then(() => {
              handleClose();
            })
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Tài Khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={`${user.avatar}`} alt="Avatar" className="user-avatar" />
        </div>

        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">Họ và tên</label>
          <div className="input-group">
            <input id="name" name="name" className="form-control" type="text" value={user.hoTen}
              readOnly />
            <span className="input-group-text " id="basic-addon2">{user.userIdUx}</span>
          </div>

          <label htmlFor="exampleFormControlInput1">Tên người dùng</label>
          <input id="userName" name="username" className="form-control" type="text" value={user.accountDTO?.username}
            readOnly={user.accountDTO} onChange={handleInputChange} disabled={!isEditing} />

          <label htmlFor="exampleFormControlInput1">Mật khẩu</label>
          <input id="password" name="password" className="form-control" type="password" value={user.accountDTO?.password}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="roles">Cấp quyền màn hình</label>
          <div className="card flex justify-content-center">
            <TreeSelect
              value={selectedNodeKeys}
              disabled={!isEditing}
              onChange={(e) => setSelectedNodeKeys(e.value)}
              options={nodes}
              metaKeySelection={false}
              className="md:w-20rem w-full"
              filter
              selectionMode="checkbox"
              display="chip"
              appendTo="self"
              placeholder="Chọn màn hình">
            </TreeSelect>
          </div>
          {
            user.accountDTO
            && <>
              <label htmlFor="exampleFormControlInput1">Ngày tạo</label>
              <input id="registered" name="registered" className="form-control" type="text" value={formatDateToDDMMYYYY(user.accountDTO.createdDate)}
                readOnly />
            </>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch" >
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button variant="success" disabled={!isEditing} onClick={handleSave}>Save</Button>
            <Button variant="danger" onClick={handleClose}>Close</Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
