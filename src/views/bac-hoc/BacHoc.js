  import React, { useState, useEffect } from 'react';
  import {
    CAvatar,
    CTableDataCell,
    CRow,
    CFormInput,
    CButton,
    CCol,
  } from '@coreui/react';
  import Table from '../table/Table';
  import CategoryCarousel from './CategoryCarousel';
  import 'slick-carousel/slick/slick.css';
  import 'slick-carousel/slick/slick-theme.css';
  import BacHocModal from './BacHocModal';
  import AddBacHocModal from './AddBacHocModal';
  import '../doan-sinh/DoanSinhCss/DanhSach.css';
  import axios from 'axios';
  import env from '../../env';

  const BacHoc = () => {
    const [searchName, setSearchName] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [BacHocData, setBacHocData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBacHoc, setSelectedBacHoc] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    useEffect(() => {
      fetchData();
    }, []);
      
    const fetchData = async () => {
      try {
        const response = await axios.get(`${env.apiUrl}/api/bac-hoc`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const fetchedData = response.data.data.map((item) => ({
          id: item.bacHocId,
          name: item.tenBacHoc,
          role: item.capBac,
          mota: item.moTa,
          avatar: item.avatar,
        }));
  
        setBacHocData(fetchedData);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    const handleAddBacHoc = (newBacHoc) => {
      setBacHocData((prevData) => [...prevData, newBacHoc]);
    };

    const filteredData = BacHocData.filter((bacHoc) => {
      return (
        (searchName === '' || (bacHoc.name && bacHoc.name.toLowerCase().includes(searchName.toLowerCase()))) &&
        (searchRole === '' || (bacHoc.role && bacHoc.role.toLowerCase().includes(searchRole.toLowerCase())))
      );
    });

    const handleShowModal = (bacHoc) => {
      setSelectedBacHoc(bacHoc);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedBacHoc(null);
    };

    const onReloadTable = () => {
      fetchData(); // Reload the data table after editing
    };

    


    const headers = [
      <label width={'20%'} className="fixed-width-column d-block w-100 m-0">
        Ảnh
      </label>,
      <label width={'40%'} className="fixed-width-column d-block w-100 m-0">
        Tên Bậc Học
      </label>,
      <label width={'20%'} className="fixed-width-column d-block w-100 m-0">
        Cấp Bậc
      </label>,
      <label width={'20%'} className="fixed-width-column d-block w-100 m-0">
        Thao tác
      </label>,
    ];
    
    const headerCells = [
      '',
      <CFormInput
        className="fixed-width-input"
        type="search"
        placeholder="Tìm theo tên"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />,
      <CFormInput
        className="fixed-width-input"
        type="search"
        placeholder="Tìm theo cấp bậc"
        value={searchRole}
        onChange={(e) => setSearchRole(e.target.value)}
      />,
      '',
    ];

    const renderRow = (bacHoc) => (
      <>
        <CTableDataCell>
        <CAvatar  
        src={`${env.apiUrl}/api/bac-hoc/${bacHoc.id}/image`}
        style={{ width: '50px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}
      />
        </CTableDataCell>
        <CTableDataCell>{bacHoc.name}</CTableDataCell>
        <CTableDataCell>{bacHoc.role}</CTableDataCell>
        <CTableDataCell>
          <CButton color="info" variant="outline" onClick={() => handleShowModal(bacHoc)}>
            Show
          </CButton>
        </CTableDataCell>
      </>
    );

    return (
      <div className="container-fluid">
        <CategoryCarousel categories={BacHocData} />
        <br />
        <CRow className="mb-3 d-flex">
          <CCol className="d-flex align-items-center flex-grow-1">
            <h3>Danh Sách Bậc Học</h3>
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
          searchCriteria={{ searchName, searchRole }}
        />

        {selectedBacHoc && (
          <BacHocModal show={showModal} handleClose={handleCloseModal} 
          bachoc={selectedBacHoc}  onReloadTable={onReloadTable}/>
        )}

        {showAddModal && (
          <AddBacHocModal show={showAddModal} 
          handleClose={handleCloseAddModal}
          onAddBacHoc={handleAddBacHoc} />
        )}

      </div>
    );
  };

  export default BacHoc;
