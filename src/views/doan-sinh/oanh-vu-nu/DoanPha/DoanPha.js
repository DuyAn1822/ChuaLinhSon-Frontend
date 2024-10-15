import {
  CAvatar,
  CButton,
  CCol,
  CFormInput,
  CRow,
  CTableDataCell,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';


import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import apiClient from '../../../../apiClient';
import env from '../../../../env';
import '../../../doan-sinh/DoanSinhCss/DanhSach.css';
import Table from '../../../table/Table';
import UserModal from './UserModal';

const DPOanhNu = () => {
  const [searchName, setSearchName] = useState('')
  const [searchRegistered, setSearchRegistered] = useState('')
  const [searchRole, setSearchRole] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [doanId, setDoanId] = useState(2);
  const [nhiemKyDoans, setNhiemKyDoans] = useState([]);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/api/nhiem-ky-doan`, {
        params: {
          doanId: doanId
        }
      });
      console.dir()
      setNhiemKyDoans(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredData = nhiemKyDoans.filter((nhiemKyDoan) => {
    return (
      (searchName === '' || nhiemKyDoan.hoTen.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchRole === '' || nhiemKyDoan.role.toLowerCase().includes(searchRole.toLowerCase()))
    );
  });


  const [showModal, setShowModal] = useState(false);
  const [selectedNhiemKyDoan, setSelectedNhiemKyDoan] = useState(null);

  const handleShowModal = (nhiemKyDoan) => {
    setSelectedNhiemKyDoan(nhiemKyDoan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNhiemKyDoan({});
  };

  const headers = [
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Ảnh</label>,
    <label width={'40%'} className="fixed-width-column d-block w-100 m-0">Pháp Danh || Tên</label>,
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Vai trò </label>,
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Thao tác</label>
  ];
  const headerCells = [
    '',
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo vai trò"
      value={searchRole}
      onChange={(e) => setSearchRole(e.target.value)}
    />,
    '',
  ];

  const renderRow = (nhiemKyDoan) => (
    <>
      <CTableDataCell>
        <CAvatar src={`${env.userAvatarUrl + nhiemKyDoan.pureUser?.avatar || ''}`} />
      </CTableDataCell>
      <CTableDataCell>{nhiemKyDoan.pureUser?.hoTen} || {nhiemKyDoan.pureUser?.phapDanh} </CTableDataCell>
      <CTableDataCell>{nhiemKyDoan.role}</CTableDataCell>
      <CTableDataCell>
        <CButton color="info" variant="outline" onClick={() => handleShowModal(nhiemKyDoan)}
        >Show</CButton>
      </CTableDataCell>
    </>
  );

  return (
    <div className="container-fluid">
      <br />
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Đoàn Phả Oanh Vũ Nữ </h3>
        </CCol>
      </CRow>
      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        searchCriteria={{ searchName, searchRegistered, searchRole, searchStatus }}
      />
      {selectedNhiemKyDoan && (
        <UserModal
          show={showModal}
          handleClose={handleCloseModal}
          nhiemKyDoan={selectedNhiemKyDoan}
        />
      )}
    </div>
  )
}

export default DPOanhNu