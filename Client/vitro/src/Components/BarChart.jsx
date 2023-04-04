import React, { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TeacherContext } from "../Context";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function BarChart() {
  const { getBarData, Subject, BarData } = useContext(TeacherContext);

  useEffect(() => {
    if (Subject) {
      getBarData();
    }
  }, [Subject]);

  // create a new array of percentages from BarData
  const percentages = BarData.map((item) => parseFloat(item.percentage));

  const Data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "My First dataset",
        data: [0, ...percentages], // add percentages to the data array
        backgroundColor: "red",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div>
        <div className="week-box">
          <h6>Weekly Attendence</h6>
          <Bar
            data={Data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          ></Bar>
        </div>
      </div>
    </>
  );
}

export default BarChart;
