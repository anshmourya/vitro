import React, { useState } from "react";

function RaiseIssue() {
  const [timeRange, setTimeRange] = useState("week");

  const handleButtonClick = (event) => {
    setTimeRange(event.target.value);
  };

  const tableData = [
    { name: "John Doe", weekAttendance: "5/7", monthAttendance: "20/25" },
    { name: "Jane Smith", weekAttendance: "6/7", monthAttendance: "24/25" },
    { name: "Bob Johnson", weekAttendance: "3/7", monthAttendance: "18/25" },
    { name: "Alice Brown", weekAttendance: "7/7", monthAttendance: "25/25" },
  ];
  return (
    <>
      {/* <div className="issue-form">
        <div className="issue-head">Raise Issue</div>
        <form action="" method="POST">
          <label htmlFor="">Name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="">Issue Descrption</label>
          <textarea name="description" id="description" />
          <button type="submit">Submit</button>
        </form>
      </div> */}

      <div>
        <div>
          <button onClick={handleButtonClick} value="week">
            Week
          </button>
          <button onClick={handleButtonClick} value="month">
            Month
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attendance ({timeRange})</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>
                  {timeRange === "week"
                    ? data.weekAttendance
                    : data.monthAttendance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RaiseIssue;
