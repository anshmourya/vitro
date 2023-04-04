import React, { useState, useContext } from "react";
import { TeacherContext } from "../Context";
function RankTable() {
  const { StudentData, Subject } = useContext(TeacherContext);

  return (
    <>
      <div className="table-container">
        <div className="rank-table-head"></div>
        <table className="table table-bordered table-hover TakeAttendence">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Overall Attendance</th>
            </tr>
          </thead>
          <tbody>
            {StudentData.map((row, index) => (
              <tr key={index}>
                <td>{row.rank}</td>
                <td>{row.student_name}</td>
                <td>{row.attendance_percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RankTable;
