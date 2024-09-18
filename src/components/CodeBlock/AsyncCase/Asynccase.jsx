import { HubConnectionBuilder } from "@microsoft/signalr";
import Editor from "@monaco-editor/react";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import s from "./Style.module.css";

export function Asynccase() {
  const [role, setRole] = useState("student");
  const [studentCount, setStudentCount] = useState(0);
  const [connection, setConnection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { dataCode, title: roomName } = location.state;
  const [code, setCode] = useState(dataCode);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://toms-web-app-c664d2505215.herokuapp.com/codeHub", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connect
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");

        connect
          .invoke("JoinRoom", roomName)
          .catch((err) => console.error("Error while joining room: ", err));

        connect.on("assignRole", (assignedRole) => {
          setRole(assignedRole);
        });

        connect.on("studentCountUpdate", (count) => {
          setStudentCount(count);
        });

        connect.on("receiveCodeUpdate", (updatedCode) => {
          setCode(updatedCode);
        });

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
        `https://toms-web-app-c664d2505215.herokuapp.com/getSolutionByRoom/${roomName}`,
        {
          credentials: "include",
        }
      );
      const solution = await response.text();
      console.log("Response:", response);

      if (newCode.trim() === solution.trim()) {
        alert("Success! You've matched the solution! 😄");
      }
    } catch (error) {
      console.error("Failed to fetch solution:", error);
    }
  };

  const handleCodeChange = async (newCode) => {
    setCode(newCode);
    checkSolution(newCode);

    if (connection) {
      try {
        await connection.invoke("UpdateCode", roomName, newCode);
      } catch (error) {
        console.error("Failed to send code update: ", error);
      }
    }
  };

  return (
    <div className={s.root}>
      <h1>Async case</h1>
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
