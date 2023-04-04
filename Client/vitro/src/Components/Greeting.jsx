import React, { useContext } from "react";
import Form from "react-bootstrap/Form";
import { TeacherContext } from "../Context";
function Greeting({ TeacherData }) {
  const { getStudentData } = useContext(TeacherContext);
  return (
    <>
      <div className="greeting">
        {TeacherData && TeacherData.length > 0 ? (
          <>
            <div className="greet-head">
              Hello {TeacherData[0].teacher_name} !
            </div>
            <div className="greet-option">
              <div className="class-select">
                <Form.Select
                  aria-label="Default select"
                  id="class-select"
                  onChange={(e) => getStudentData(e.target.value)}
                >
                  <option>Class</option>
                  {TeacherData.map((subject, index) => (
                    <option key={index} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default Greeting;
