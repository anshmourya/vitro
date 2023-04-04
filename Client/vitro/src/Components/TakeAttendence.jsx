import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { TeacherContext } from "../Context";
function TakeAttendence({ title }) {
  const { Subject } = useContext(TeacherContext);
  const { id } = useParams();
  const { StudentData } = useContext(TeacherContext);
  const [showModal, setShowModal] = useState(false);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Only set attendance when StudentData is available
    if (StudentData) {
      const students = StudentData.map((student) => ({
        ...student,
        attendance: null,
      }));
      setAttendance(students);
    }
  }, [StudentData]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleAttendance = (id, value) => {
    console.log("ID:", id);
    console.log("Value:", value);
    const index = attendance.findIndex((student) => student.student_id === id);
    const newAttendance = [...attendance];
    newAttendance[index].attendance = value.startsWith("P") ? 1 : 0;
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    const markedStudents = attendance.filter(
      (student) => student.attendance !== null
    );

    try {
      // Send marked students data to the server
      const response = await axios.post(
        `http://localhost:4000/dashboard/teacher/${id}/mark-attendance`,
        {
          markedStudents,
          Subject,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {title}
      </Button>

      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title> {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {StudentData ? (
            <Table striped bordered hover className="TakeAttendence">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                </tr>
              </thead>
              <tbody>
                {attendance
                  .filter((student) => student.attendance === null)
                  .map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>{student.student_name}</td>
                      <td>{student.roll_no}</td>
                      <td>
                        <div className="btn-takeattendence">
                          <button
                            onClick={() =>
                              handleAttendance(student.student_id, "P")
                            }
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleAttendance(student.student_id, "A")
                            }
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleSubmit}
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

export default TakeAttendence;
