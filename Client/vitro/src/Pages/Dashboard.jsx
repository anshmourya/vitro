import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarChart from "../Components/BarChart";
import "../Components/global.css"; //css file
import Navbar from "../Components/Navbar";
import RankTable from "../Components/RankTable";
import SubjectAttendence from "../Components/SubjectAttendence";
import SubjectBar from "../Components/SubjectBar";
import TeacherCard from "../Components/TeacherCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/dashboard/student/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          if (data.err === "Access denied") {
            navigate("/");
          } else if (data.err === "Unauthorized") {
            navigate("/Signin");
          } else if (
            data.err === "You are not authorized to access this resource."
          ) {
            navigate(`/dashboard/student/${data.userId}`);
          }
        }
      } catch (error) {
        // handle login error
        throw error;
      }
    };
    getData();
  }, [id, navigate]);
  return (
    <>
      <Navbar />
      <TeacherCard />
      <div className="A-one container">
        <BarChart />
        <SubjectBar />
      </div>
      <div className="grid-two container">
        <RankTable />
        <SubjectAttendence />
      </div>
    </>
  );
};

export default Dashboard;
