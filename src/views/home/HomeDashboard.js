import {
  CAvatar,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CTableFoot
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

import { cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import FiltersBarChart from "../charts/ChartBar"
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import axios from 'axios';
import apiClient from '../../apiClient'

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/api/users', {
          params: { is_huynh_truong: false }
        });
        const users = response.data.data;
        setUsers(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const tableExample = users.map(user => ({
    avatar: user.avatar,
    user: {
      name: `${user.phapDanh} || ${user.hoTen}`,
    },
    role1: user.roleId1 ? user.roleId1.roleName : 'Chưa có',
    role2: user.roleId2 ? user.roleId2.roleName : 'Chưa có',
  }));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = tableExample.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  // Determine pages to display
  let startPage, endPage;
  if (currentPage === 1) {
    startPage = 1;
    endPage = Math.min(3, totalPages); // Only show up to 3 pages max at the start
  } else {
    startPage = currentPage - 1;
    endPage = Math.min(currentPage + 1, totalPages); // Always show 3 pages centered around current
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <CRow xs={{ gutter: 3 }}>
        <CCol sm={6} md={8}>
          <CTable align="middle" hover responsive style={{ minHeight: 'auto' }}>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Pháp Danh || Tên</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Vai Trò</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Vai Trò 2</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <img src={`${item.avatar}`} style={{ width: '35px', height: '35px', borderRadius: '50%' }} alt="Avatar" />
                  </CTableDataCell>
                  <CTableDataCell>{item.user.name}</CTableDataCell>
                  <CTableDataCell>{item.role1}</CTableDataCell>
                  <CTableDataCell>{item.role2}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CTableFoot>
            <CPagination aria-label="Page navigation example" className="justify-content-end">
              <CPaginationItem
                aria-label="Previous"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                &laquo;
              </CPaginationItem>

              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNumber => (
                <CPaginationItem
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </CPaginationItem>
              ))}

              <CPaginationItem
                aria-label="Next"
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                &raquo;
              </CPaginationItem>
            </CPagination>
          </CTableFoot>
        </CCol>
        <CCol sm={6} md={4}>
          <WidgetsDropdown className="d-flex flex-column" />
        </CCol>
      </CRow>
      <br />
      <FiltersBarChart />
    </>
  );
};

export default Home;
