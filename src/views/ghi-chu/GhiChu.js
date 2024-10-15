import React, { useState, useEffect } from 'react';
import {
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
} from '@coreui/react'
import Table from '../table/Table';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import GhiChuModal from './GhiChuModal';
import AddGhiChuModal from './AddGhiChuModal';
import '../doan-sinh/DoanSinhCss/DanhSach.css';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../../apiClient';
import Swal from 'sweetalert2';

const GhiChu = () => {
  const [searchName, setSearchName] = useState('');
  const [GhiChuData, setGhiChuData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGhiChu, setSelectedGhiChu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [idAccount, setIdAccount] = useState('');

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  useEffect(() => {
    fetchData();
  }, []);
    
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const decodedToken = jwtDecode(token);
      const idAccount = decodedToken.account_id;
      setIdAccount(idAccount);
      const response = await apiClient.get(`/api/notes/account/${idAccount}`, {
      });
      if (response.status === 200) {

        const fetchedData = response.data.data.map((item) => ({
          id: item.noteId,
          name: item.noteName,
          mota: item.noteContent,
        }));
        setGhiChuData(fetchedData);

      } else {
        console.error('Failed to load profile, status:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while fetching profile:', error);
    }
  };

  const filteredData = GhiChuData.filter((ghiChu) => {
    return (
      (searchName === '' || (ghiChu.name && ghiChu.name.toLowerCase().includes(searchName.toLowerCase()))) 
    );
  });

  const handleShowModal = (ghiChu) => {
    setSelectedGhiChu(ghiChu);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGhiChu(null);
  };

  const onReloadTable = () => {
    fetchData(); // Reload the data table after editing
  };

  const handleAddGhiChu = (newGhiChu) => {
    setGhiChuData((prevData) => [...prevData, newGhiChu]);
  };

  const handleDeleteGhiChu = async (ghiChu) => {
    const result = await Swal.fire({
      title: 'Xác nhận xoá!',
      text: `Bạn có chắc chắn muốn xoá Ghi Chú "${ghiChu.name}" không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xoá!',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const response = await apiClient.delete(`/api/notes/${ghiChu.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          Swal.fire({
            title: 'Thông báo từ hệ thống!',
            text: 'Xoá Ghi Chú thành công!',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          // Reload the table data after deletion
          fetchData();
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Swal.fire({
          title: 'Thông báo từ hệ thống!',
          text: 'Xoá Ghi Chú thất bại.',
          icon: 'error',
        });
      }
    }
  };


  const headers = [

    <label width={'50%'} className="fixed-width-column d-block w-100 m-0">
      Tên Ghi Chú
    </label>,
    <label width={'60%'} className="fixed-width-column d-block w-100 m-0">
      Mô Tả
    </label>,
  ];
  
  const headerCells = [
    <CFormInput
      className="fixed-width-input"
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    '',
  ];

  const renderRow = (ghiChu) => (
    <>

      <CTableDataCell>{ghiChu.name}</CTableDataCell>
      <CTableDataCell>
      <CDropdown>
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem variant="outline" onClick={() => handleShowModal(ghiChu)}>
              Thông tin
            </CDropdownItem>
            <CDropdownItem variant="outline" onClick={() => handleDeleteGhiChu(ghiChu)}>
              Xoá Ghi Chú
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CTableDataCell>
    </>
  );

  return (
    <div className="container-fluid">

      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Ghi Chú</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton variant="outline" color="info" onClick={handleShowAddModal} >Thêm</CButton>
        </CCol>
      </CRow>

      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        searchCriteria={{ searchName }}
      />

        {selectedGhiChu && (
        <GhiChuModal show={showModal} handleClose={handleCloseModal} 
        ghiChu={selectedGhiChu}  onReloadTable={onReloadTable}/>
        )}

        {showAddModal && (
          <AddGhiChuModal show={showAddModal} 
          handleClose={handleCloseAddModal}
          onAddGhiChu={handleAddGhiChu}
        />
        )}
  

    </div>
  );
};

export default GhiChu;
