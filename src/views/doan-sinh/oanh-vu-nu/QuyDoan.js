import {
    CButton,
    CCol,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CFormSelect,
    CFormTextarea,
} from '@coreui/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Table from '../../table/Table';
import WidgetsBrand from '../../huynh-truong/WidgetsBrand';
import '../DoanSinhCss/DanhSach.css';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';

const QuyGD = () => {
    const [searchName, setSearchName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [fundData, setFundData] = useState([]);
    const [fundData2, setFundData2] = useState({
        totalAmount: 0,
        totalIncome: 0,
        totalExpense: 0
    });
    const getCurrentQuarter = useCallback(() => {
        const month = new Date().getMonth() + 1;
        if (month >= 1 && month <= 3) return '1';
        if (month >= 4 && month <= 6) return '2';
        if (month >= 7 && month <= 9) return '3';
        return '4';
    }, []);
    const [newFund, setNewFund] = useState({
        lichSuQuyDoanId: 0,
        tenThuChi: '',
        moTa: '',
        thuOrChi: false,
        soTien: 0,
        ngayThem: new Date(),
        year: new Date().getFullYear(),
        quy: getCurrentQuarter(), // Đặt giá trị quý hiện tại mặc định
    });
    const [selectedMoTa, setSelectedMoTa] = useState('');
    const [selectedLichSuQuyId, setSelectedLichSuQuyId] = useState(0);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedQuarter, setSelectedQuarter] = useState('0'); // Khởi tạo với giá trị mặc định '0'
    const [selectedNgayThem, setSelectedNgayThem] = useState('');
    const [objectExcel, setObjectExcel] = useState([]);

    useEffect(() => {
        fetchFundData();

    }, []); // Chạy hàm fetchFundData khi component mount

    const fetchFundData = async () => {
        try {
            const response = await apiClient.get(`/api/quy-doan/get-lich-su-quy-doan?quyDoanId=2`);
            const apiData = response.data.data;
            const formattedData = apiData.flatMap((fund) =>
                fund.lichSuQuyDoanDTOS.map((item) => ({
                    lichSuQuyDoanId: item.lichSuQuyDoanId,
                    tenThuChi: item.tenThuChi || 'Chưa có tên quỹ',
                    moTa: item.moTa || 'Không có mô tả',
                    soTien: item.soTien || 0,
                    ngayThem: item.ngayThem || 'Chưa có ngày',
                    thuOrChi: item.thuOrChi,
                    year: item.year || 0,
                    quy: item.quy || 0,
                }))
            );

            const uniqueYears = [...new Set(apiData.flatMap((fund) =>
                fund.lichSuQuyDoanDTOS.map((item) => item.year)
            ))].sort((a, b) => b - a);

            setFundData(formattedData);
            setYears(uniqueYears);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Hàm lọc dữ liệu theo năm, quý và tên
    const filteredData = useMemo(() => fundData.filter((fund) => {
        const matchesName = searchName === '' || fund.tenThuChi.toLowerCase().includes(searchName.toLowerCase());
        const matchesNgayThem = selectedNgayThem === '' || fund.ngayThem.toLowerCase().includes(selectedNgayThem.toLowerCase());
        const matchesYear = selectedYear === '' || fund.year === parseInt(selectedYear);
        const matchesQuarter = selectedQuarter === '0' || fund.quy === parseInt(selectedQuarter);
        // console.log(searchName, selectedYear, selectedQuarter);

        return matchesName && matchesYear && matchesQuarter && matchesNgayThem;
    }), [fundData, searchName, selectedYear, selectedQuarter, selectedNgayThem]);

    useEffect(() => {
        let totalAmount = 0;
        let totalIncome = 0;
        let totalExpense = 0;

        filteredData.forEach(item => {
            const amount = item.soTien || 0;

            if (item.thuOrChi) {
                totalIncome += amount;
                totalAmount += amount;
            } else {
                totalExpense += amount;
                totalAmount -= amount;
            }
        });
        setObjectExcel(filteredData);
        setFundData2({ totalAmount, totalIncome, totalExpense });
    }, [filteredData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFund(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        if (name === 'thuOrChi') {
            setNewFund(prev => ({
                ...prev,
                thuOrChi: value === 'Thu',
            }));
        } else {
            setNewFund(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    // Hàm xử lý thêm quỹ
    const handleAddFund = async () => {
        if (newFund.tenThuChi === '' || newFund.soTien === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                text: 'Tên thu chi và số tiền không được để trống.',
                showConfirmButton: true,
            });
            return;
        }
        if (newFund.soTien < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Số tiền không hợp lệ',
                text: 'Số tiền phải lớn hơn hoặc bằng 0.',
                showConfirmButton: true,
            });
            r
            return;
        }
        if (isNaN(newFund.soTien)) {
            Swal.fire({
                icon: 'error',
                title: 'Số tiền không hợp lệ',
                text: 'Số tiền phải là số.',
                showConfirmButton: true,
            });
            return;
        }

        newFund.quyDoanId = 2;
        newFund.quy = parseInt(newFund.quy);
        let user = localStorage.getItem('user');
        let userObj = JSON.parse(user);
        newFund.userId = userObj.user_id;
        newFund.soTien = parseInt(newFund.soTien);
        try {
            await apiClient.post(`/api/lich-su-quy-doan`, newFund);
            Swal.fire({
                icon: 'success',
                title: 'Thêm quỹ thành công',
                showConfirmButton: false,
                timer: 1500,
            });
            await fetchFundData();
            setModalVisible(false);
            setNewFund({
                tenThuChi: '',
                moTa: '',
                thuOrChi: false,
                soTien: 0,
                year: new Date().getFullYear(),
                quy: getCurrentQuarter(),
            });
            // Tải lại dữ liệu quỹ
        } catch (error) {
            console.error('Error adding fund:', error);
        }
    };

    const handleUpdateMoTa = async () => {
        const result = await Swal.fire({
            title: "Thông báo từ hệ thống!",
            text: "Bạn có chắc chắn muốn cập nhật mô tả?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
            try {
                const response = await apiClient.patch(`/api/lich-su-quy-doan/${selectedLichSuQuyId}/description?description=${selectedMoTa}`);

                // Cập nhật dữ liệu sau khi chỉnh sửa
                await fetchFundData();
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    showConfirmButton: true,
                });
                setModalVisible2(false);
            } catch (error) {
                console.error('Error updating fund:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật thất bại!',
                    text: 'Có lỗi xảy ra khi cập nhật mô tả.',
                    showConfirmButton: true,
                });
            }
        }
    };


    const handleDownloadExcel = async () => {
        Swal.fire({
            title: 'Đang tạo file...',
            text: 'Vui lòng chờ trong giây lát.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Hiển thị icon loading
            },
        });
        let data = objectExcel;
        data.push(fundData2);
        
        try {
            const response = await apiClient.post('/api/export-excel/quy', data, {
                params: {
                    filename: 'quy-doan-oanh-vu-nu.xlsx',
                },
                responseType: 'blob', // Quan trọng: Để nhận file nhị phân
            });
            
            // Tạo link để tải file ngay sau khi file được tạo thành công
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'quy-doan-oanh-vu-nu.xlsx'); // Tên file
            document.body.appendChild(link);
    
            Swal.fire({
                icon: 'success',
                title: 'File đã sẵn sàng để tải xuống!',
                confirmButtonText: 'Tải xuống',
                allowOutsideClick: false, 
                allowEscapeKey: false, 
            }).then((result) => {
                if (result.isConfirmed) {
                    // Tải file nếu người dùng chọn "Tải xuống"
                    link.click();
                }
                // Xóa liên kết khỏi body sau khi người dùng đóng popup
                document.body.removeChild(link);
                URL.revokeObjectURL(url); // Giải phóng URL đối tượng
            });
    
        } catch (error) {
            console.error('Error downloading the Excel file', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi khi tải file',
                text: 'Đã có lỗi xảy ra trong quá trình tải file.',
            });
        }
        await fetchFundData();
    };


    const headers = useMemo(() => [
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Tên Thu Chi</label>,
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Ngày</label>,
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Số tiền</label>,
        <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Mô tả</label>
    ], []);

    const headerCells = useMemo(() => [
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo ngày"
            value={selectedNgayThem}
            onChange={(e) => setSelectedNgayThem(e.target.value)}
        />,
        '',
        ''
    ], [searchName, selectedNgayThem]);



    const renderRow = useCallback((fund) => (
        <>
            <CTableDataCell>{fund.tenThuChi}</CTableDataCell>
            <CTableDataCell>{formatDate(fund.ngayThem)}</CTableDataCell>
            <CTableDataCell>
                <div style={{ display: 'inline-flex' }}>
                    <div style={{ marginRight: '5px' }}>
                        <span style={{ color: fund.thuOrChi ? 'green' : 'red' }}>
                            {(fund.thuOrChi) ? '+' : '-'}{fund.soTien}
                        </span>
                    </div>
                    <div><span>VNĐ</span></div>
                </div>
            </CTableDataCell>
            <CTableDataCell>
                <CDropdown>
                    <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem onClick={() => {
                            // Tách phần mô tả theo dấu '-'
                            const parts = fund.moTa.split('-');

                            if (parts.length <= 1) {
                                setSelectedMoTa(fund.moTa); // Nếu không có dấu '-', không cần thay đổi
                            } else {
                                // Phần đầu tiên không thay đổi
                                let firstPart = parts[0].trim();
                                if (firstPart.length === 0) {
                                    parts.shift();
                                    firstPart = parts[0].trim();
                                }

                                // Phần còn lại, mỗi phần bắt đầu với '- ' và xuống dòng
                                const restParts = parts.slice(1).map(part => `\n- ${part.trim()}`);

                                // Kết hợp phần đầu tiên với các phần còn lại
                                const formattedMoTa = `${`- ` + firstPart + restParts.join('')}`;

                                setSelectedMoTa(formattedMoTa);
                            }
                            setSelectedLichSuQuyId(fund.lichSuQuyDoanId);
                            setModalVisible2(true);
                        }}>Xem mô tả</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CTableDataCell>
        </>
    ), []);

    return (
        <div className="container-fluid">
            <WidgetsBrand
                totalAmount={fundData2.totalAmount}
                totalIncome={fundData2.totalIncome}
                totalExpense={fundData2.totalExpense}
            />

            <CRow className="my-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Quỹ Đoàn Oanh Vũ Nữ</h3>
                </CCol>
                <CCol className="d-flex justify-content-end">
                    <CFormSelect
                        className="me-2"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Chọn năm</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </CFormSelect>
                    <CFormSelect className='me-2'
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                    >
                        <option value="0">Chọn quý</option>
                        <option value="1">Quý 1</option>
                        <option value="2">Quý 2</option>
                        <option value="3">Quý 3</option>
                        <option value="4">Quý 4</option>
                    </CFormSelect>
                    <CButton variant="outline" color="info" className='me-2' onClick={handleDownloadExcel}>
                        Excel
                    </CButton>
                    <CButton variant="outline" color="info" onClick={() => setModalVisible(true)}>
                        Thêm
                    </CButton>
                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData}
                renderRow={renderRow}
                searchCriteria={{ searchName, selectedYear, selectedQuarter }}
            />

            {/* Modal hiển thị mô tả */}
            <CModal visible={modalVisible2} scrollable alignment="center" onClose={() => setModalVisible2(false)}>
                <CModalHeader>
                    <CModalTitle>Mô tả</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        rows="5"
                        value={selectedMoTa}
                        onChange={(e) => setSelectedMoTa(e.target.value)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton className='btn-success' onClick={handleUpdateMoTa}>
                        Lưu
                    </CButton>
                    <CButton className='btn-danger' onClick={() => setModalVisible2(false)}>
                        Thoát
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal thêm quỹ mới */}
            <CModal visible={modalVisible} scrollable alignment="center" onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Thêm Quỹ Mới</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Tên Thu Chi"
                        name="tenThuChi"
                        value={newFund.tenThuChi}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormInput
                        label="Số tiền"
                        name="soTien"
                        value={newFund.soTien === 0 ? '' : newFund.soTien}
                        type="number"
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormInput
                        label="Mô tả"
                        name="moTa"
                        value={newFund.moTa}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormSelect
                        label="Loại Quỹ"
                        name="thuOrChi"
                        value={newFund.thuOrChi ? 'Thu' : 'Chi'}
                        onChange={handleSelectChange}
                        className="mb-3"
                    >
                        <option value={"Thu"}>Thu</option>
                        <option value={"Chi"}>Chi</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Quý"
                        name="quy"
                        value={newFund.quy}
                        onChange={handleInputChange}
                        className="mb-3" disabled
                    >
                        <option value="0">Chọn quý</option>
                        <option value="1">Quý 1 (tháng 1,2,3)</option>
                        <option value="2">Quý 2 (tháng 4,5,6)</option>
                        <option value="3">Quý 3 (tháng 7,8,9)</option>
                        <option value="4">Quý 4 (tháng 10,11,12)</option>
                    </CFormSelect>
                    <CFormInput
                        label="Năm"
                        name="year"
                        type="number"
                        value={newFund.year}
                        onChange={handleInputChange}
                        className="mb-3"
                        disabled
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton className='btn-success' onClick={handleAddFund}>
                        Lưu
                    </CButton>
                    <CButton className='btn-danger' onClick={() => setModalVisible(false)}>
                        Thoát
                    </CButton>
                </CModalFooter>
            </CModal>

        </div>
    );
}

export default QuyGD;
