import React, { createContext, useState } from "react";
import { useParams } from "react-router-dom";
export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
    const [StudentData, setStudentData] = useState([]);
    const [BarData, setBarData] = useState([]);
    const [PieData, setPieData] = useState([]);
    const [SubjectData, setSubjectData] = useState([]);
    const [DownloadRecord, setDownloadRecord] = useState([]);
    const [CardData, setCardData] = useState([]);
    const [Subject, setSubject] = useState();
    const { id } = useParams();

    const getStudentData = async (subject_id) => {
        setSubject(subject_id)
        try {
            const response = await fetch(
                `http://localhost:4000/dashboard/teacher/${id}/students/${subject_id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            console.log(data);
            setStudentData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const getBarData = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/dashboard/teacher/${id}/students/${Subject}/barData`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();

            setBarData(data);
        } catch (error) {
            console.error(error);
        }
    };
    const getPieData = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/dashboard/teacher/${id}/students/${Subject}/piechart`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setPieData(data)

        } catch (error) {
            console.error(error);
        }
    }
    const getSubjectRecord = async (sub_id) => {
        try {
            const response = await fetch(
                `http://localhost:4000/dashboard/teacher/${id}/students/${sub_id}/subject`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setSubjectData(data);

            return SubjectData;

        } catch (error) {
            console.error(error);
        }
    }

    const getDownloadData = async (days) => {

        try {
            const response = await fetch(
                `http://localhost:4000/dashboard/teacher/${id}/students/${days}/download`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setDownloadRecord(data)
            return DownloadRecord;

        } catch (error) {
            console.error(error);
        }

    }
    // const getCardData = async () => {
    //     const days = 1;
    //     try {
    //         const response = await fetch(
    //             `http://localhost:4000/dashboard/teacher/${id}/students/${days}/download`,
    //             {
    //                 method: "GET",
    //                 credentials: "include",
    //             }
    //         );
    //         const data = await response.json();
    //         setCardData(data)

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    return (
        <TeacherContext.Provider value={{ StudentData, getStudentData, Subject, getBarData, BarData, getPieData, PieData, getSubjectRecord, SubjectData, getDownloadData, DownloadRecord, }}>
            {children}
        </TeacherContext.Provider>
    );
};