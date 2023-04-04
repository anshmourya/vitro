import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarChart from "../Components/BarChart";
import Doughnuts from "../Components/Doughnuts";
import DownloadRecord from "../Components/DownloadRecord";
import Greeting from "../Components/Greeting";
import Navbar from "../Components/Navbar";
import RankTable from "../Components/RankTable";
import SingleStudent from "../Components/SingleStudent";
import SubjectAttendence from "../Components/SubjectAttendence";
import TakeAttendence from "../Components/TakeAttendence";
import TeacherCard from "../Components/TeacherCard";
import { TeacherProvider } from "../Context";

function TeacherDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/dashboard/teacher/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setData(data);
        console.log(data);
        if (!response.ok) {
          if (data.err === "Access denied") {
            navigate("/");
          } else if (data.err === "Unauthorized") {
            navigate("/Signin");
          } else if (
            data.err === "You are not authorized to access this resource."
          ) {
            navigate(`/dashboard/teacher/${data.userId}`);
          }
        }
      } catch (error) {
        // handle login error
        throw error;
      }
    };
    getData();
  }, []);

  return (
    <>
      <TeacherProvider>
        <Navbar />
        <Greeting TeacherData={Data} />
        {/* <TeacherCard /> */}
        <div className="second-container container">
          <TakeAttendence title="Attendence" />
          <SingleStudent title="Only Absent" />
          <SingleStudent title="Only Present" />
          <DownloadRecord title={"Weekly Download"} />
          <DownloadRecord title={"Monthly Download"} />
        </div>
        <div className="first-container container">
          <BarChart />
          <Doughnuts />
        </div>
        <div className="first-container container">
          <RankTable />
          <SubjectAttendence data={Data} />
        </div>
      </TeacherProvider>
    </>
  );
}

export default TeacherDashboard;
