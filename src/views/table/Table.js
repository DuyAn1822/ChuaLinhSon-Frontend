import { CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';

const Table = ({ headers, headerCells, items, renderRow, searchCriteria }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const maxPageButtons = 3;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchCriteria.searchName, searchCriteria.selectedYear, searchCriteria.selectedQuarter, searchCriteria.searchRegistered
        , searchCriteria.searchRole, searchCriteria.searchStatus, searchCriteria.searchTerm,
    ]);

    const renderPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li
                    className={`page-item ${currentPage === i ? 'active' : ''}`}
                    key={i}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <>
            <CTable hover responsive striped border={1}>
                <CTableHead>
                    <CTableRow className="g-3 align-middle" >
                        {headers.map((header, index) => (
                            <CTableHeaderCell className='align-middle' key={index}>{header}</CTableHeaderCell>
                        ))}
                    </CTableRow>
                    <CTableRow className="align-middle">
                        {headerCells.map((headerCell, index) => (
                            <CTableDataCell key={index}>{headerCell}</CTableDataCell>
                        ))}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <CTableRow key={index} className="align-middle">
                                {renderRow(item)}
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan={headers.length}>
                                Không tìm thấy dữ liệu
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable>

            <div className="card-footer align-items-center">
                <div className="row d-flex">
                    <div className="col-6 mb-3">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        aria-label="Previous"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        aria-label="Next"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <span className="me-2 mt-1">Dòng:</span>
                        <CFormSelect
                            style={{ width: 'auto', height: '50%' }}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </CFormSelect>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Table;
