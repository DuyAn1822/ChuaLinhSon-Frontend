import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { jwtDecode } from 'jwt-decode'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import apiClient from '../apiClient'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token) {
          throw new Error("Token không tồn tại")
        }

        const decodedToken = jwtDecode(token)
        const userId = decodedToken.user_id
        const roleName1 = user.role_name1;
        const roleName2 = user.role_name2;
        const isAdminUser = ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName1) ||
          ['Bác Đoàn Trưởng', 'Liên Đoàn Trưởng', 'Admin'].includes(roleName2);

        const url = isAdminUser
          ? `/api/notifications/admin/${userId}/unread`
          : `/api/notifications/user/${userId}/unread`
        const response = await apiClient.get(url)
        setNotifications(response.data)
        setUnreadCount(response.data.length)
      } catch (error) {
        console.error('Failed to fetch notifications', error.response ? error.response.data : error.message)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await apiClient.post(`/api/notifications/${notificationId}/read`, {})

      setNotifications(notifications.filter(notification => notification.id !== notificationId))
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          {/* Navigation items can go here */}
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item" direction="dropup-center">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilBell} size="lg" />
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 end-0 rounded-circle"
                  style={{ backgroundColor: 'red', color: 'white', padding: '0.2em 0.6em', fontSize: '0.5em' }}
                >
                  {unreadCount}
                </span>
              )}
            </CDropdownToggle>

            <CDropdownMenu className="p-0" style={{ minWidth: '300px' }}>
              {/* Header */}
              <div className="dropdown-header bg-light text-center font-weight-bold">
                Thông Báo
              </div>

              {/* Body with Scroll */}
              <div
                className="p-2"
                style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <CDropdownItem
                      key={notification.id}

                      onClick={() => {
                        markAsRead(notification.id)
                        window.location.href = '/#/thong-bao'
                      }}

                    >
                      {notification.message}
                    </CDropdownItem>
                  ))
                ) : (
                  <CDropdownItem disabled>
                    Không có thông báo
                  </CDropdownItem>
                )}
              </div>
            </CDropdownMenu>
          </CDropdown>

          {/* Other header items */}
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Sáng
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Tối
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Tự Động
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
