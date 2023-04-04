import React, { useContext, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import SubjectRecord from "./SubjectRecord";
import { TeacherContext } from "../Context";

function SubjectAttendence({ data }) {
  const { getSubjectRecord, SubjectData } = useContext(TeacherContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const handleSubjectClick = async (subjectId) => {
    const records = await getSubjectRecord(subjectId);
    setAttendanceRecords(records);
  };

  return (
    <>
      <div className="subject-attendence">
        <div className="subject-attendence-heading"></div>
        <div className="subject-attendence-body">
          <ListGroup>
            {data.map((subject) => (
              <ListGroup.Item
                key={subject.subject_id}
                onClick={() => handleSubjectClick(subject.subject_id)}
                className="subject-record"
              >
                <SubjectRecord
                  id={subject.subject_id}
                  name={subject.subject_name}
                  attendanceRecords={attendanceRecords}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </>
  );
}

export default SubjectAttendence;
