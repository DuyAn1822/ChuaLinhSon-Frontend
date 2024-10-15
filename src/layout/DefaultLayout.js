import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import apiClient from '../apiClient'
import Swal from 'sweetalert2'



const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/#login';
      return;
    }
    try {
      const isLogin = apiClient.get(`/api/auth/is-login`);
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Lỗi xác thực, vui lòng đăng nhập lại!'
      }).then(() => {
        window.location.href = '/#login';
      })
    }
  }, [navigate])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
