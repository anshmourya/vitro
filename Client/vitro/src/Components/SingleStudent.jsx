import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { TeacherContext } from "../Context";

function SingleStudent({ title }) {
  const { id } = useParams();
  const [selectedRollNo, setSelectedRollNo] = useState("");
  const [selectedRollNos, setSelectedRollNos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { StudentData, Subject } = useContext(TeacherContext);
  const [attendance, setAttendance] = useState([]);
  const rollno = StudentData.map((student) => student.roll_no); // extract roll numbers from StudentData

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleSelectRollNo = (e) => {
    setSelectedRollNo(e.target.value);
  };
  const addtable = () => {
    const selectedStudent = StudentData.find(
      (student) => student.roll_no === selectedRollNo
    );
    if (selectedStudent) {
      setSelectedRollNos([...selectedRollNos, selectedStudent]);
      setAttendance([...attendance, { ...selectedStudent, attendance: 0 }]);
    }
  };
  const handleSubmit = async () => {
    const markedStudents = attendance.filter(
      (student) => student.attendance !== null
    );

    const updatedMarkedStudents = markedStudents.map((student) => {
      if (title === "Only Absent") {
        return {
          ...student,
          attendance: 0,
        };
      } else if (title === "Only Present") {
        return {
          ...student,
          attendance: 1,
        };
      } else {
        return student;
      }
    });

    try {
      // Send marked students data to the server
      const response = await axios.post(
        `http://localhost:4000/dashboard/teacher/${id}/mark-attendance`,
        {
          markedStudents: updatedMarkedStudents,
          Subject,
        }
      );
      console.log(updatedMarkedStudents);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
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
          <div className="single-student">
            <input
              type="text"
              name="rollno"
              id="rollno"
              list="rollno-list"
              value={selectedRollNo}
              onChange={handleSelectRollNo}
            />
            <button onClick={addtable} className="w3-btn w3-blue">
              add to table
            </button>
          </div>
          <datalist id="rollno-list">
            {rollno.slice(0, 4).map((rollno) => (
              <option key={rollno} value={rollno} />
            ))}
          </datalist>

          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm table-light TakeAttendence ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                </tr>
              </thead>
              <tbody>
                {selectedRollNos.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.student_name}</td>
                    <td>{student.roll_no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleSubmit()}
            disabled={attendance.some((student) => student.attendance === null)}
            className="submit-takeattendence"
          >
            Submit Attendance
          </button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SingleStudent;
