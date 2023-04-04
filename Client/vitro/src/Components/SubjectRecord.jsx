import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TeacherContext } from "../Context";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function SubjectRecord({ id, name }) {
  const [showModal, setShowModal] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
    getAttendanceRecords();
  };
  const { getSubjectRecord, SubjectData } = useContext(TeacherContext);

  useEffect(() => {
    getAttendanceRecords();
  }, []);

  const getAttendanceRecords = async () => {
    setIsLoading(true);
    const response = await getSubjectRecord(id);
    setAttendanceRecords(response);
    setIsLoading(false);
  };

  const handleDownloadExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = `${name}_attendance${fileExtension}`;
    const formattedData = attendanceRecords.map((record) => {
      return {
        "Roll No": record.roll_no,
        Name: record.student_name,
        Percentage: Number(record.percentage).toFixed(1),
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = attendanceRecords.map((record) => {
      return [
        record.roll_no,
        record.student_name,
        Number(record.percentage).toFixed(1),
      ];
    });
    doc.autoTable({
      head: [["Roll No", "Name", "Percentage"]],
      body: tableData,
    });
    const fileName = `${name}_attendance.pdf`;
    doc.save(fileName);
  };

  return (
    <>
      <Button className="me-2 mb-2" onClick={handleShow}>
        {name}
      </Button>
      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">Roll No</th>
                    <th scope="col">Name</th>
                    <th scope="col">percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{record.roll_no}</th>
                        <td>{record.student_name}</td>
                        <td>{Number(record.percentage).toFixed(1)} %</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadExcel}>
            Download Excel
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SubjectRecord;
