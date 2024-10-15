import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CButton,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CFormLabel
} from '@coreui/react'
import {
    cilLowVision,
    cilXCircle
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode'
import apiClient from '../../apiClient'

const ChangePass = ({ modalVisible, onCloseModal }) => {
    const [passwordType, setPasswordType] = useState('password');
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordType((prevType) => prevType === 'password' ? 'text' : 'password');
    }

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordType((prevType) => prevType === 'password' ? 'text' : 'password');
    }

    const handleConfirmChange = async () => {
        if (!newPassword || !confirmPassword) {
            Swal.fire({
                title: "Lỗi!",
                text: "Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu!",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: "Lỗi!",
                text: "Mật khẩu và xác nhận mật khẩu không khớp!",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token không tồn tại");
            }

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user_id;
            const user = JSON.parse(localStorage.getItem('user'));
            const roleName1 = user.role_name1;
            const roleName2 = user.role_name2;
            // Gửi yêu cầu đổi mật khẩu đến API với token trong header
            const response = await apiClient.post('/api/password-change-requests', {
                userId: userId,
                newPassword: newPassword
            });
            
            if (roleName1 === 'Bác Đoàn Trưởng' || roleName2 === 'Bác Đoàn Trưởng'
                || roleName1 === 'Liên Đoàn Trưởng' || roleName2 === 'Liên Đoàn Trưởng'
                || roleName1 === 'Admin' || roleName2 === 'Admin') {
                Swal.fire({
                    title: "Thành công.",
                    text: "Đổi mật khẩu thành công",
                    icon: "success"
                }).then(() => {
                    onCloseModal();
                });
            } else {
                Swal.fire({
                    title: "Thông báo từ hệ thống!",
                    text: "Đang chờ được xét duyệt, vào phần thông báo để chờ phản hồi từ admin...",
                    icon: "info",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    timer: 3000,
                    timerProgressBar: true,
                }).then(() => {
                    onCloseModal();
                     window.location.href = '/#/thong-bao'
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể gửi yêu cầu đổi mật khẩu!",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }



    return (
        <>
            <CModal alignment='center' scrollable visible={modalVisible} onClose={onCloseModal}>
                <CModalHeader>
                    <CModalTitle>Đổi mật khẩu</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                        <CInputGroup>
                            <CFormInput
                                type={passwordType}
                                id="newPassword"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <CInputGroupText onClick={togglePasswordVisibility}>
                                <CIcon icon={passwordType === 'password' ? cilLowVision : cilXCircle} />
                            </CInputGroupText>
                        </CInputGroup>
                    </div>

                    <div className="mb-3">
                        <CFormLabel htmlFor="confirmPassword">Xác nhận mật khẩu</CFormLabel>
                        <CInputGroup>
                            <CFormInput
                                type={confirmPasswordType}
                                id="confirmPassword"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <CInputGroupText onClick={toggleConfirmPasswordVisibility}>
                                <CIcon icon={confirmPasswordType === 'password' ? cilLowVision : cilXCircle} />
                            </CInputGroupText>
                        </CInputGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="outline-secondary" onClick={handleConfirmChange}>
                        Thay đổi mật khẩu
                    </CButton>
                    <CButton color="outline-secondary" onClick={onCloseModal}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default ChangePass
