import {
    CButton,
    CCol,
    CFormInput,
    CInputGroup,
    CRow,
    CTableDataCell
} from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { authorizeRole } from '../../AuthorizationContext';
import env from '../../env';
import '../doan-sinh/DoanSinhCss/DanhSach.css';
import Table from '../table/Table';

// Hàm format date từ dd-mm-yyyy sang đối tượng Date
const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
}

const FileLuuTru = () => {
    const MySwal = withReactContent(Swal);
    // const { role } = useRole();

    const [searchName, setSearchName] = useState('')
    const [searchRegistered, setSearchRegistered] = useState('')
    // const [searchRole, setSearchRole] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [fileData, setFileData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            axios.get(`${env.apiUrl}/api/files`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm Authorization header
                }
            })
                .then(response => {
                    setFileData(response.data.data);
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const filteredData = fileData.filter((user) => {
        const registeredDate = formatDate(user.registered);
        const searchDate = searchRegistered ? searchRegistered.split('-') : [];

        // Nếu chỉ nhập năm
        if (searchDate.length === 1 && searchDate[0].length === 4) {
            const searchYear = parseInt(searchDate[0], 10);
            return (
                (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
                // (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
                (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
                registeredDate.getFullYear() === searchYear
            );
        }

        // Nếu nhập đầy đủ ngày-tháng-năm
        if (searchDate.length === 3) {
            const [searchDay, searchMonth, searchYear] = searchDate.map(Number);
            return (
                (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
                // (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
                (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
                registeredDate.getDate() === searchDay &&
                registeredDate.getMonth() + 1 === searchMonth &&
                registeredDate.getFullYear() === searchYear
            );
        }

        // Mặc định trả về khi không nhập ngày đăng ký
        return (
            (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
            // (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
            (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase()))
        );
    });

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const dowloadFile = async (name) => {
        let timerInterval;
        MySwal.fire({
            title: "Tải file từ hệ thống",
            html: "Vui lòng đợi hệ thống xử lý <b></b> giây.",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false, // Ngăn người dùng nhấn ra ngoài để tắt bảng
            allowEscapeKey: false, // Ngăn người dùng nhấn phím Escape để tắt bảng
            didOpen: () => {
                MySwal.showLoading();
                const timer = MySwal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === MySwal.DismissReason.timer) {
                try {
                    axios.get(`${env.apiUrl}/api/files/download?fileName=${name}`, {
                        responseType: 'blob', // Nhận dữ liệu dưới dạng Blob
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm Authorization header
                        }
                    })
                        .then(response => {
                            // Dữ liệu Blob từ phản hồi
                            const blob = response.data;

                            // Tạo URL tạm thời cho file và tải xuống
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', name); // Đặt tên file để tải về
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url); // Giải phóng URL
                        })
                        .catch(error => {
                            console.error('Error downloading file:', error);
                        });

                } catch (error) {
                    MySwal.fire({
                        title: "Lỗi?",
                        text: "Có lỗi trong quá trình tải, vui lòng thử lại!",
                        icon: "error"
                    });
                }
            }
        });
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = (name) => {
        if (selectedFile) {
            const backName = selectedFile.name.split('.').pop().toLowerCase();
            const fileAccess = ['docx', 'xlsx'];
            if (fileAccess.includes(backName)) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    axios.post(`${env.apiUrl}/api/files/upload`, formData, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm Authorization header
                            'Content-Type': 'multipart/form-data' // Đảm bảo rằng nội dung là form-data
                        }
                    })
                        .then(response => {
                            let timerInterval;
                            Swal.fire({
                                title: "Đang tải file lên hệ thống!",
                                html: "Vui lòng chờ trong <b></b> s.",
                                timer: 2500,
                                timerProgressBar: true,
                                allowOutsideClick: false, // Ngăn người dùng nhấn ra ngoài để tắt bảng
                                allowEscapeKey: false, // Ngăn người dùng nhấn phím Escape để tắt bảng
                                didOpen: () => {
                                    Swal.showLoading();
                                    const timer = Swal.getPopup().querySelector("b");
                                    timerInterval = setInterval(() => {
                                        timer.textContent = `${Swal.getTimerLeft()}`;
                                    }, 100);
                                },
                                willClose: () => {
                                    clearInterval(timerInterval);
                                }
                            }).then((result) => {
                                /* Read more about handling dismissals below */
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    MySwal.fire({
                                        title: "Thông báo!",
                                        text: "Tải file thành công.",
                                        icon: "success"
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            fetchFiles();
                                            document.getElementById('clone').click();
                                            fileInputRef.current.value = "";
                                        }
                                    });
                                }
                            });
                        })
                        .catch(error => {
                            MySwal.fire({
                                title: "Thông báo!",
                                text: "Có lỗi sinh ra trong quá trinh tải file, vui lòng tải lại.",
                                icon: "error"
                            });
                        });
                } catch (error) {

                }
            } else {
                MySwal.fire({
                    title: "Thông báo!",
                    text: "Vui lòng chọn lại file có đuôi là ( .docx | .xlsx )",
                    icon: "warning"
                });
            }
        } else {
            MySwal.fire({
                title: "Thông báo!",
                text: "Vui lòng chọn file trước khi up",
                icon: "warning"
            });
        }
    }

    const deleteFile = (name) => {
        MySwal.fire({
            title: "Thông báo!",
            text: "Bạn có chắc là muốn xoá file này.",
            icon: "warning"
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: "Thông báo!",
                    text: "Xoá file thành công.",
                    icon: "success"
                });

                axios.delete(`${env.apiUrl}/api/files/${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(response => {
                        fetchFiles();
                    })
                    .catch(error => {
                        MySwal.fire({
                            title: "Thông báo!",
                            text: "Có lỗi trong quá trình xoá file",
                            icon: "error"
                        });
                    });
            }
        });
    }

    const headers = [
        <label width={'50%'} className='fixed-width-column d-block w-100 m-0'>Tên</label>,
        <label width={'45%'} className='fixed-width-column d-block w-100 m-0'>Ngày</label>,
        <label width={'5%'} className='fixed-width-column d-block w-100 m-0'></label>,

    ];
    const headerCells = [
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo ngày (dd-mm-yyyy)"
            value={searchRegistered}
            onChange={(e) => setSearchRegistered(e.target.value)}
        />,
        "",
    ];

    const isAuthorized = authorizeRole(["Thư Ký"]);

    const renderRow = (user) => (
        <>
            <CTableDataCell>{user.name}</CTableDataCell>
            <CTableDataCell>{user.registered}</CTableDataCell>
            {/* <CTableDataCell>
                <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
                    {user.status}
                </CBadge>
            </CTableDataCell> */}
            <CTableDataCell className="text-center">
                <CButton color="success" variant="outline" onClick={() => dowloadFile(user.name)}>Tải</CButton>
                {isAuthorized && <CButton color="danger" variant="outline" style={{ marginLeft: '10px' }} onClick={() => deleteFile(user.name)}>Xoá</CButton>}
            </CTableDataCell>
        </>
    );

    return (
        <div>
            <div className="container-fluid">
                <CRow className="mb-3 d-flex">
                    <CCol className="d-flex align-items-center flex-grow-1">
                        <h3>File lưu trữ</h3>
                    </CCol>
                    {isAuthorized &&
                        <CCol className="d-flex justify-content-end">
                            <CButton variant="outline" color="info" data-bs-toggle="modal" data-bs-target="#exampleModal">Thêm</CButton>
                        </CCol>}
                </CRow>

                <Table
                    headers={headers}
                    headerCells={headerCells}
                    items={filteredData}
                    renderRow={renderRow}
                    searchCriteria={{ searchName, searchRegistered }}
                />
            </div>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Tải File</h1>
                        </div>
                        <div className="modal-body">
                            <CInputGroup className="">
                                <CFormInput type="file" id="inputGroupFile02" accept=".docx, .xlsx" ref={fileInputRef} onChange={handleFileChange} />
                            </CInputGroup>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id='clone'>Thoát</button>
                            <button type="button" className="btn btn-primary" onClick={uploadFile}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileLuuTru
