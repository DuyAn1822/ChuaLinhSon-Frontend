import {
    CButton,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormInput,
    CFormSelect,
    CRow,
    CTableDataCell
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';
import Table from '../../table/Table';
import '../DoanSinhCss/DanhSach.css';
import '../DoanSinhCss/DiemDanh.css';

const DDThieuNu = () => {
    const [searchTerm, setSearchTerm] = useState({
        tuan: '',
        ngaySinhHoat: '',
        nam: ''
    });
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, index) => currentYear + index);
    const [doanId, setDoanId] = useState(4);
    const [lichSinhHoatDoan, setLichSinhHoatDoan] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedLichSinhHoatDoan, setSelectedLichSinhHoatDoan] = useState();
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [show, setShow] = useState(false);
    const [isHuynhTruong, setIsHuynhTruong] = useState();
    const [filename, setFilename] = useState('DiemDanhThieuNu.xlsx');

    useEffect(() => {
        getLichSinhHoatDoan();
    }, []);

    useEffect(() => {
        onChangeSelectedLichSinhHoatDoan();
    }, [selectedLichSinhHoatDoan]);

    const diemDanhVar = {
        coMat: 'X',
        coPhep: 'P',
        khongPhep: 'K',
        checkboxCoMat: 'checkbox-coMat',
        checkboxCoPhep: 'checkbox-coPhep'
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const addLichSinhHoatDoan = () => {
        Swal.fire({
            icon: 'question',
            title: `Bạn có muốn tạo lịch sinh hoạt năm ${selectedYear} cho đoàn này?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let timerInterval;
                    Swal.fire({
                        title: "Vui lòng đợi xử lý thông tin!",
                        timer: 5000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                            apiClient.post(`/api/lich-sinh-hoat-doan?`, null, {
                                params: {
                                    doanId: doanId,
                                    year: selectedYear
                                }
                            });
                        },
                        willClose: () => {
                            getLichSinhHoatDoan();
                            clearInterval(timerInterval);
                        }
                    }).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: `Tạo lịch năm ${selectedYear} thành công`
                        })
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        })
    }

    const getLichSinhHoatDoan = () => {
        apiClient.get(`/api/lich-sinh-hoat-doan`, {
            params: {
                doanId: doanId
            }
        }).then(response => {
            setLichSinhHoatDoan(response.data.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const filteredData = lichSinhHoatDoan?.filter(item => {
        const formattedDate = formatDate(item.ngaySinhHoat);
        return (
            (searchTerm.tuan === '' || item.sttTuan.toString().includes(searchTerm.tuan)) &&
            (searchTerm.ngaySinhHoat === '' || formattedDate.includes(searchTerm.ngaySinhHoat)) &&
            (searchTerm.nam === '' || item.nam.toString().includes(searchTerm.nam))
        );
    });

    const headers = [
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Tuần</label>,
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Ngày sinh hoạt</label>,
        <label width={'30%'} className="fixed-width-column d-block w-100 m-0">Năm</label>,
        <label width={'10%'} className="fixed-width-column d-block w-100 m-0"></label>,
    ];

    const headerCells = [
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tuần"
            value={searchTerm.tuan}
            onChange={(e) => setSearchTerm({ ...searchTerm, tuan: e.target.value })}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo ngày sinh hoạt"
            value={searchTerm.ngaySinhHoat}
            onChange={(e) => setSearchTerm({ ...searchTerm, ngaySinhHoat: e.target.value })}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo năm"
            value={searchTerm.nam}
            onChange={(e) => setSearchTerm({ ...searchTerm, nam: e.target.value })}
        />,
        ''
    ];

    const onChangeSelectedLichSinhHoatDoan = () => {
        var tempFormData = {};
        let userId = JSON.parse(localStorage.getItem('user'))?.user_id;
        selectedLichSinhHoatDoan?.diemDanhDTOS?.forEach(diemDanhDTO => {
            tempFormData = {
                ...tempFormData,
                [diemDanhDTO.diemDanhId]: {
                    diemDanhId: diemDanhDTO.diemDanhId,
                    coMat: diemDanhDTO.coMat,
                    lichSinhHoatDoanId: diemDanhDTO.lichSinhHoatDoanId,
                    userUpdate: userId,
                    doanSinhDetailDTO: diemDanhDTO.doanSinhDetailDTO,
                    nhiemKyDoanDTO: diemDanhDTO.nhiemKyDoanDTO,
                    changed: false
                }
            }
        });
        setFormData(tempFormData);
    }

    const checkDiemDanhDTOS = (item) => {
        if (item.diemDanhDTOS.length > 0 && item.diemDanhDTOS.some(value => Boolean(value))) {
            setSelectedLichSinhHoatDoan(item)
        } else {
            try {
                let timerInterval;
                let responseData;
                Swal.fire({
                    title: "Vui lòng đợi xử lý thông tin!",
                    timer: 2500,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                        apiClient.put(
                            `/api/lich-sinh-hoat-doan/diem-danh`, null, {
                            params: {
                                lichSinhHoatDoanId: item.lichSinhHoatDoanId,
                                isActive: true
                            }
                        }
                        ).then(response => {
                            responseData = response.data.data;
                        })
                    },
                    willClose: () => {
                        getLichSinhHoatDoan();
                        setSelectedLichSinhHoatDoan(responseData);
                        clearInterval(timerInterval);
                    }
                })
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleCoMatChange = (checked, id, diemDanhDTO) => {
        setFormData({
            ...formData,
            [diemDanhDTO.diemDanhId]: {
                ...formData[diemDanhDTO.diemDanhId],
                changed: true,
                coMat: (id.startsWith(diemDanhVar.checkboxCoMat) && checked) ? diemDanhVar.coMat
                    : (id.startsWith(diemDanhVar.checkboxCoPhep) && checked) ? diemDanhVar.coPhep
                        : diemDanhVar.khongPhep
            }
        });
    }

    const getFormData = () => {
        const qualifiedFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value.changed === true)
        );
        var keys = Object.keys(qualifiedFormData);
        return keys?.map(key => {
            return {
                diemDanhId: key,
                coMat: qualifiedFormData[key].coMat,
                lichSinhHoatDoanId: qualifiedFormData[key].lichSinhHoatDoanId,
                userUpdate: qualifiedFormData[key].userUpdate,
                doanSinhDetailDTO: qualifiedFormData[key].doanSinhDetailDTO,
                nhiemKyDoanDTO: qualifiedFormData[key].nhiemKyDoanDTO
            }
        })
    }

    const handleSaveDiemDanh = async () => {
        let isFailed = false;
        try {
            handleEditToggle();
            const payload = getFormData();
            let timerInterval;
            Swal.fire({
                title: "Vui lòng đợi xử lý thông tin!",
                timer: 3000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                    apiClient.put(`/api/diem-danh/bulk-update`, payload);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
        } catch {
            isFailed = true
        } finally {
            if (!isFailed) {
                getLichSinhHoatDoan();
                Swal.fire({
                    icon: isFailed ? 'error' : 'success',
                    title: `Điểm danh ${isFailed ? 'thất bại' : 'thành công'}!`
                }).then(() => {
                    handleClose();
                })
            }
        }
    }

    const handleDownloadExtract = async () => {
        try {
          // Hiển thị Swal với trạng thái đang tải
          Swal.fire({
            title: 'Đang tạo file...',
            text: 'Vui lòng chờ trong giây lát.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading(); // Hiển thị icon loading
            },
          });
    
          // Gọi API với các tham số
          const response = await apiClient.get('/api/export-excel/danh-sach-diem-danh', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
              filename: filename,
              doan_id:'4',
              year: selectedYear
            },
            responseType: 'arraybuffer',
          });
    
          // Tạo Blob từ dữ liệu phản hồi
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
    
          // Tạo phần tử liên kết để tải file
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
          document.body.appendChild(a); // Thêm liên kết vào body
    
    
          Swal.fire({
            icon: 'success',
            title: 'File đã sẵn sàng để tải xuống!',
            confirmButtonText: 'Tải xuống',
            allowOutsideClick: false, // Không cho phép nhấp ra ngoài để đóng Swal
            allowEscapeKey: false, // Không cho phép dùng phím Escape để thoát Swal
          }).then((result) => {
            if (result.isConfirmed) {
              // Tạo phần tử liên kết để tải file
              const a = document.createElement('a');
              a.href = url;
              a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
              document.body.appendChild(a); // Thêm liên kết vào body
              a.click(); // Nhấp vào liên kết để kích hoạt tải xuống
              document.body.removeChild(a); // Xóa liên kết khỏi body
              URL.revokeObjectURL(url); // Giải phóng URL đối tượng
            }
          });
        } catch (error) {
          console.error('Lỗi khi tải tệp:', error);
          // Cập nhật Swal khi có lỗi
          Swal.fire({
            icon: 'error',
            title: 'Tải tệp không thành công',
            text: 'Vui lòng thử lại.',
          });
        }
      };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    }

    const renderRow = (item) => (
        <>
            <CTableDataCell>{item.sttTuan}</CTableDataCell>
            <CTableDataCell>{formatDate(item.ngaySinhHoat)}</CTableDataCell>
            <CTableDataCell>{item.nam}</CTableDataCell>
            <CTableDataCell>
                <CDropdown>
                    <CDropdownToggle variant="outline" color="info"
                        disabled={isFuture(item.ngaySinhHoat)}>Điểm danh</CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem className="custom-dropdown-item"
                            onClick={() => { setIsHuynhTruong(true); checkDiemDanhDTOS(item); setShow(true); }}
                            variant="outline" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Điểm danh huynh trưởng
                        </CDropdownItem>
                        <CDropdownItem className="custom-dropdown-item"
                            onClick={() => { setIsHuynhTruong(false); checkDiemDanhDTOS(item); setShow(true); }}
                            variant="outline" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Điểm danh đoàn sinh
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CTableDataCell>
        </>
    );

    const isFuture = (date) => {
        // return false;
        const givenDate = new Date(date);
        const now = new Date();
        givenDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return givenDate > now;
    }

    const isPastExact = (date) => {
        // return false;
        const givenDate = new Date(date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return givenDate < now;
    }

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        setSelectedLichSinhHoatDoan(null);
    }

    const renderDiemDanhs = () => {
        const qualifiedDiemDanhDTOS = selectedLichSinhHoatDoan?.diemDanhDTOS?.filter(
            (diemDanhDTO) => (isHuynhTruong ? diemDanhDTO?.nhiemKyDoanDTO : diemDanhDTO?.doanSinhDetailDTO));
        return qualifiedDiemDanhDTOS?.map((element) => {
            let person = isHuynhTruong ? element.nhiemKyDoanDTO : element.doanSinhDetailDTO;
            return (<tr className='align-items-center'>
                <td>
                    <img
                        src={`${person.avatar}`}
                        alt="Ảnh"
                        className="rounded-image"
                        width="50"
                        height="50"
                    />
                </td>
                <td>{person.hoTen}</td>
                <td>{formatDate(selectedLichSinhHoatDoan.ngaySinhHoat)}</td>
                <td>{person.tenDoan}</td>
                <td className=''>
                    <div className="checkbox-con">
                        <input id={`checkbox-coMat-${element.diemDanhId}`} type="checkbox" disabled={!isEditing}
                            checked={formData[element.diemDanhId]?.coMat === diemDanhVar.coMat || false} onChange={(e) => handleCoMatChange(e.target.checked, e.target.id, element)}>
                        </input>
                    </div>
                </td>
                <td className=''>
                    <div className="checkbox-con">
                        <input id={`checkbox-coPhep-${element.diemDanhId}`} type="checkbox" disabled={!isEditing}
                            checked={formData[element.diemDanhId]?.coMat === diemDanhVar.coPhep || false} onChange={(e) => handleCoMatChange(e.target.checked, e.target.id, element)}>
                        </input>
                    </div>
                </td>
            </tr>);
        })
    }

    return (
        <div className="container-fluid">

            <CRow className="mb-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Lịch sinh hoạt đoàn Thiếu Nữ</h3>
                </CCol>
                <CCol className="d-flex justify-content-end">
                    <CFormSelect className="small-select me-2" onChange={handleYearChange}
                        style={{ width: 'auto' }} aria-label="Chọn năm" >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}
                            </option>
                        ))}
                    </CFormSelect>
                    <CButton variant="outline" color="info" onClick={addLichSinhHoatDoan}>Thêm</CButton>
                    <CButton variant="outline" color="info" onClick={handleDownloadExtract} style={{ marginRight: "5px" }}>Excel</CButton>
                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData || []}
                renderRow={renderRow}
                searchCriteria={{ searchTerm }}
            />

            <Modal show={show} scrollable onHide={handleClose} centered className='modal-lg'>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Điểm danh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='table-responsive'>
                        <table className='table table-border table-striped table-hover'>
                            <thead>
                                <tr className=' align-items-center'>
                                    <th >Ảnh</th>
                                    <th >Tên</th>
                                    <th >Ngày sinh hoạt</th>
                                    <th >Đoàn</th>
                                    <th >Có mặt</th>
                                    <th >Có phép</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderDiemDanhs()}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check form-switch" >
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                            checked={isEditing} onChange={handleEditToggle} disabled={isPastExact(selectedLichSinhHoatDoan?.ngaySinhHoat)} />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
                    </div>
                    <div className="footer-buttons">
                        <Button variant="success" disabled={!isEditing} onClick={handleSaveDiemDanh} >
                            Save
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DDThieuNu