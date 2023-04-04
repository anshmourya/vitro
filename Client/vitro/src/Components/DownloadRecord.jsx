import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { TeacherContext } from "../Context";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function DownloadRecord({ title }) {
  const { getDownloadData, DownloadRecord } = useContext(TeacherContext);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [days, setdays] = useState();
  const [loading, setLoading] = useState(true);
  const [downloadBtnDisabled, setDownloadBtnDisabled] = useState(true);
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    if (title == "Weekly Download") {
      setdays(7);
    } else {
      setdays(30);
    }
    setShowModal(true);
    fetchData();
  };

  const fetchData = async () => {
    console.log("Fetching data...");
    setLoading(true);
    const result = await getDownloadData(7);
    setData(result);
    setLoading(false);
    console.log(result);
    console.log("Data fetched!");
  };

  useEffect(() => {
    if (data !== null) {
      setDownloadBtnDisabled(false);
    }
  }, [data]);

  const downloadPDF = () => {
    const headers = [["Roll No.", "Category"]];
    const body = data.map((d) => [d.student_id, d.attendance_category]);
    const doc = new jsPDF();
    doc.autoTable({
      head: headers,
      body: body,
      startY: 20,
    });
    doc.save("Record.pdf");
  };

  const downloadXLSX = () => {
    const headers = ["Roll No.", "Category"];
    const body = data.map((d) => [d.student_id, d.attendance_category]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...body]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Record");
    XLSX.writeFile(workbook, "Record.xlsx");
  };

  console.log("Rendering DownloadRecord");

  return (
    <>
      <Button className="me-2 mb-2" onClick={handleShow}>
        {title}
      </Button>
      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div>Loading...</div>
          ) : data ? (
            <>
              <table className="table TakeAttendence">
                <thead>
                  <tr>
                    <th scope="col">Roll No.</th>
                    <th scope="col">Percentage.</th>
                    <th scope="col">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d) => (
                    <tr key={d.student_id}>
                      <td>{d.student_id}</td>
                      <td>{d.percentage}</td>
                      <td>{d.attendance_category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div>There was an error fetching the data.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="me-2 mb-2"
            onClick={downloadPDF}
            disabled={downloadBtnDisabled}
          >
            Download PDF
          </Button>
          <Button
            className="me-2 mb-2"
            onClick={downloadXLSX}
            disabled={downloadBtnDisabled}
          >
            Download XLSX
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DownloadRecord;
