import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { TeacherContext } from "../Context";

const TeacherCard = () => {
  const { id } = useParams();
  const { Subject } = useContext(TeacherContext);
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    const days = 1;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/dashboard/teacher/${id}/students/${days}/TeacherCard`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setCardData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [Subject]);

  return (
    <>
      <div className="container">
        <div className="row Card">
          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-green order-card">
              <div className="card-block">
                <h6 className="m-b-20">Total Student</h6>
                <h2 className="text-right">
                  <i className="fa-solid fa-school f-left"></i>
                  <span>{cardData[0].total_students}</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-green order-card">
              <div className="card-block">
                <h6 className="m-b-20">Total Present</h6>
                <h2 className="text-right">
                  <i className="fa-solid fa-school f-left"></i>
                  <span>
                    {" "}
                    {Number(cardData[0].present_percentage).toFixed(2)}
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-green order-card">
              <div className="card-block">
                <h6 className="m-b-20">Total Absent</h6>
                <h2 className="text-right">
                  <i className="fa-solid fa-school f-left"></i>
                  <span>
                    {Number(cardData[0].absent_percentage).toFixed(2)}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherCard;
