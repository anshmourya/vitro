import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
function SubjectBar() {
  return (
    <>
      <div>
        <div className="subject-box">
          <h6>Statistics</h6>
          <div className="subject-bar">
            <p>DBMS</p>
            <ProgressBar now={80} label={`DBMS`} />
          </div>
          <div className="subject-bar">
            <p>Software E</p>
            <ProgressBar now={50} label={`Software E`} />
          </div>
          <div className="subject-bar">
            <p>Computer Graphics</p>
            <ProgressBar now={60} label={`Computer Graphics`} />
          </div>
          <div className="subject-bar">
            <p>Maths</p>
            <ProgressBar now={70} label={`Maths`} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SubjectBar;
