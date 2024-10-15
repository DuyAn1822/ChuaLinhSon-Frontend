import React, { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes,HashRouter} from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'
import { AuthorizationProvider } from './AuthorizationContext'
import './scss/style.scss'
import UnauthorizedPage from './views/pages/page401/401Page'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthorizationProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/401" name="Page 401" element={<UnauthorizedPage />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
            {/* <Route path="/doan-sinh/ds-thieu-nam" element={
              <ProtectedRoute
                element={<DSThieuNam />}
                requiredRole={[Role.ROLE_DOANTRUONG_THIEUNAM]}
              />
            } />
            <Route path="/doan-sinh/ds-oanh-vu-nam" element={
              <ProtectedRoute
                element={<DSOanhNam />}
                requiredRole={[Role.ROLE_DOANTRUONG_OANHVUNAM]}
              />
            } /> */}
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthorizationProvider>
  )
}

export default App
