import { HubConnectionBuilder } from "@microsoft/signalr";
import Editor from "@monaco-editor/react";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import s from "./Style.module.css";

export function EventLoopExplained() {
  const [role, setRole] = useState("student");
  const [studentCount, setStudentCount] = useState(0);
  const [connection, setConnection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { dataCode, title: roomName } = location.state;
  const [code, setCode] = useState(dataCode);
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://localhost:7015/codeHub", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connect
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");

        // הצטרפות לחדר
        connect
          .invoke("JoinRoom", roomName)
          .catch((err) => console.error("Error while joining room: ", err));

        // קבלת התפקיד - מנטור או סטודנט
        connect.on("assignRole", (assignedRole) => {
          setRole(assignedRole);
        });

        // קבלת עדכון מספר הסטודנטים
        connect.on("studentCountUpdate", (count) => {
          setStudentCount(count);
        });

        // קבלת קוד מעודכן בזמן אמת
        connect.on("receiveCodeUpdate", (updatedCode) => {
          setCode(updatedCode);
        });

        // הודעת עזיבת המנטור
        connect.on("mentorLeft", () => {
          alert("The mentor has left. Returning to lobby.");
          navigate("/");
        });

        setConnection(connect);
      })
      .catch((error) => console.error("Connection failed: ", error));

    return () => {
      if (connect) {
        connect.stop();
      }
    };
  }, [navigate, roomName]);

  const checkSolution = async (newCode) => {
    try {
      const response = await fetch(
        `https://localhost:7015/getSolutionByRoom/${roomName}`
      );
      const solution = await response.text(); // קבלת הפתרון מהשרת
      if (newCode.trim() === solution.trim()) {
        alert("Success! You've matched the solution! 😄");
      }
    } catch (error) {
      console.error("Failed to fetch solution:", error);
    }
  };

  // שליחת עדכון קוד בזמן אמת
  const handleCodeChange = async (newCode) => {
    setCode(newCode); // עדכון הקוד בעורך
    checkSolution(newCode); // בדיקת התאמת הקוד לפתרון

    if (connection) {
      try {
        await connection.invoke("UpdateCode", roomName, newCode); // שליחת הקוד לשרת ולעדכן בזמן אמת
      } catch (error) {
        console.error("Failed to send code update: ", error);
      }
    }
  };
  return (
    <div className={s.root}>
      <h1>Event Loop Explained</h1>
      <div className={s.infoContainer}>
        <p className={s.role}>Your role: {role}</p>
        <p className={s.number}>Number of students: {studentCount}</p>
      </div>
      <Editor
        height="400px"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(newCode) => handleCodeChange(newCode)}
        options={{ readOnly: role === "mentor" }}
      />
      <div className={s.button_container}>
        <button className={s.back_button} onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
}
