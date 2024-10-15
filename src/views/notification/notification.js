import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; // Import SweetAlert2
import {
  CButton,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert
} from '@coreui/react';
import apiClient from '../../apiClient';

const Notification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchNotifications(); // Gọi khi component load

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      console.error("Token hoặc thông tin người dùng không tồn tại");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;
    const roleName1 = user.role_name1;
    const roleName2 = user.role_name2;

    const isAdminUser = ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName1) || 
                        ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName2);
    setIsAdmin(isAdminUser);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user) {
        console.error("Token hoặc thông tin người dùng không tồn tại");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      const roleName1 = user.role_name1;
      const roleName2 = user.role_name2;

      const isAdminUser = ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName1) || 
                          ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName2);
      setIsAdmin(isAdminUser);

      const endpoint = isAdminUser
        ? `/api/notifications/admin/${userId}`
        : `/api/notifications/user/${userId}`;

      const response = await apiClient.get(endpoint);
      setNotifications(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
    }
  };

  const handleApprove = async (notificationId, passwordChangeRequestId) => {
    if (!passwordChangeRequestId) {
      console.error('passwordChangeRequestId không có');
      return;
    }

    try {
      await apiClient.post(`/api/password-change-requests/approve/${passwordChangeRequestId}`, {});
      
      Swal.fire({
        title: 'Đã chấp nhận!',
        text: 'Yêu cầu đã được chấp nhận.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchNotifications(); // Gọi lại API sau khi nhấn OK
      });
    } catch (error) {
      console.error('Error approving request:', error);
      Swal.fire({
        title: 'Có lỗi xảy ra!',
        text: 'Không thể chấp nhận yêu cầu.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleReject = async (notificationId, passwordChangeRequestId) => {
    if (!passwordChangeRequestId) {
      console.error('passwordChangeRequestId không có');
      return;
    }

    try {
      await apiClient.post(`/api/password-change-requests/reject/${passwordChangeRequestId}`, {});
      
      Swal.fire({
        title: 'Đã từ chối!',
        text: 'Yêu cầu đã bị từ chối.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchNotifications(); // Gọi lại API sau khi nhấn OK
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      Swal.fire({
        title: 'Có lỗi xảy ra!',
        text: 'Không thể từ chối yêu cầu.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const filteredNotifications = Array.isArray(notifications) ?
    notifications.filter(notification =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  return (
    <>
      <div>
        <h1>Thông Báo</h1>
      </div>

      <div>
        <div className="container-fluid">
          <CRow className="mb-3 d-flex"></CRow>

          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CFormInput
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Nội dung</CTableHeaderCell>
                <CTableHeaderCell>Ngày</CTableHeaderCell>
                {isAdmin && <CTableHeaderCell>Trạng thái</CTableHeaderCell>}
                {isAdmin && <CTableHeaderCell>Hành động</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredNotifications.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={isAdmin ? 5 : 3} style={{ textAlign: 'center' }}><CAlert color="warning">
                    Không có thông báo nào.
                  </CAlert></CTableDataCell>
                </CTableRow>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <CTableRow key={notification.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell style={{ minWidth: '250px' }}>{notification.message}</CTableDataCell>
                    <CTableDataCell style={{ minWidth: '100px' }}>{notification.createdAt}</CTableDataCell>
                    {isAdmin && (
                      <CTableDataCell style={{ minWidth: '100px' }}>
                        {notification.status}
                      </CTableDataCell>
                    )}
                    {isAdmin && (
                      <CTableDataCell style={{ minWidth: '170px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <CButton
                            color="success"
                            variant="outline"
                            size="sm"
                            shape="rounded-pill"
                            onClick={() => handleApprove(notification.id, notification.passwordChangeRequest.id)}
                          >
                            Chấp nhận
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            shape="rounded-pill"
                            onClick={() => handleReject(notification.id, notification.passwordChangeRequest.id)}
                          >
                            Từ chối
                          </CButton>
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
};

export default Notification;
