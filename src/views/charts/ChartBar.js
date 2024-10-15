import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { CRow, CCol } from "@coreui/react";
import "./ChartBar.css";
import apiClient from "../../apiClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FiltersBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Đoàn Sinh Có Mặt",
        data: [],
        backgroundColor: "#3a86ff",
        borderRadius: 50,
        maxBarThickness: 20,
      },
      {
        label: "Đoàn Sinh Vắng Mặt",
        data: [],
        backgroundColor: "#bc4b51",
        borderRadius: 50,
        maxBarThickness: 20,
      },
    ],
  });

  const [filter, setFilter] = useState("quarter1"); 
  const [year, setYear] = useState(new Date().getFullYear());
  const [allData, setAllData] = useState({ labels: [], doanSinhCoMat: [], doanSinhVangMat: [] });

  const fetchDiemDanhData = async (selectedYear) => {
    try {
      const response = await apiClient.get(`/api/thong-ke/diem-danh?nam=${selectedYear}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data.data;
      const labels = data.map((item, index) => `Tuần ${index + 1}`);
      const doanSinhCoMat = data.map((item) => item.doanSinhCoMat);
      const doanSinhVangMat = data.map((item) => item.doanSinhVangMat);
      const ngaySinhHoat = data.map((item) => item.ngaySinhHoat);  
      setAllData({ labels, doanSinhCoMat, doanSinhVangMat, ngaySinhHoat });

      // Hiển thị tuần 1-10 khi tải trang
      setChartData({
        labels: labels.slice(0, 10),
        datasets: [
          {
            label: "Đoàn Sinh Có Mặt",
            data: doanSinhCoMat.slice(0, 10),
            backgroundColor: "#3a86ff",
            borderRadius: 50,
            maxBarThickness: 20,
          },
          {
            label: "Đoàn Sinh Vắng Mặt",
            data: doanSinhVangMat.slice(0, 10),
            backgroundColor: "#bc4b51",
            borderRadius: 50,
            maxBarThickness: 20,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchDiemDanhData(year);
  }, []); 

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);

    const quarterWeeks = {
      quarter1: { start: 0, end: 10 },
      quarter2: { start: 10, end: 20 },
      quarter3: { start: 20, end: 30 },
      quarter4: { start: 30, end: 40 },
      quarter5: { start: 40, end: 50 },
      quarter6: { start: 50, end: 52 },
    };

    const selectedWeeks = quarterWeeks[value];

    setChartData({
      labels: allData.labels.slice(selectedWeeks.start, selectedWeeks.end),
      datasets: [
        {
          label: "Đoàn Sinh Có Mặt",
          data: allData.doanSinhCoMat.slice(selectedWeeks.start, selectedWeeks.end),
          backgroundColor: "#3a86ff",
          borderRadius: 50,
          maxBarThickness: 20,
        },
        {
          label: "Đoàn Sinh Vắng Mặt",
          data: allData.doanSinhVangMat.slice(selectedWeeks.start, selectedWeeks.end),
          backgroundColor: "#bc4b51",
          borderRadius: 50,
          maxBarThickness: 20,
        },
      ],
    });
  };


  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (year) {
      fetchDiemDanhData(year);
    }
  };

  const containerStyle = {
    border: "2px solid rgba(8, 10, 12, .175)",
    borderRadius: "8px",
    padding: "10px",
  };

  return (
    <div className="chart-container" style={containerStyle}>
      <div className="form-group">
        <h3>Điểm Danh Theo:</h3>
        <br />
        <CRow>
          <CCol md="10">
            <select value={filter} onChange={handleFilterChange} id="quarter-select" className="form-select" aria-label="Default select example">
              <option value="quarter1">Tuần 1 &#8594; 10</option>
              <option value="quarter2">Tuần 10 &#8594; 20</option>
              <option value="quarter3">Tuần 20 &#8594; 30</option>
              <option value="quarter4">Tuần 30 &#8594; 40</option>
              <option value="quarter5">Tuần 40 &#8594; 50</option>
              <option value="quarter6">Tuần 50 &#8594; 52</option>
            </select>
          </CCol>

          <CCol md="2">
            <form className="form" onSubmit={handleSearch}>
              <button type="submit">
                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                  <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <input className="input" placeholder="Nhập số năm" required type="text" value={year} onChange={handleYearChange}></input>
            </form>
          </CCol>
        </CRow>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                title: (context) => {
                  const index = context[0].dataIndex;
                  const week = context[0].label;
                  const ngaySinhHoat = allData.ngaySinhHoat[index];
                  return `${week} - Ngày sinh hoạt: ${ngaySinhHoat}`;
                },
                label: (context) => {
                  const datasets = context.chart.data.datasets;
                  const label1 = `${datasets[0].label}: ${datasets[0].data[context.dataIndex]}`;
                  const label2 = `${datasets[1].label}: ${datasets[1].data[context.dataIndex]}`;
                  return [label1, label2];
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                callback: function (value, index) {
                  const label = this.getLabelForValue(value); 
                  const ngaySinhHoat = allData.ngaySinhHoat[index];  
                  return `${label}\n(${new Date(ngaySinhHoat).toLocaleDateString('vi-VN')})`; 
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default FiltersBarChart;
