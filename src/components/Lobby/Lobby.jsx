import React from "react";
import { useNavigate } from "react-router-dom";
import s from "./Style.module.css";

export function Lobby() {
  const navigate = useNavigate();

  async function Navigator(e) {
    const name = e.target.name;
    const sharat = `https://toms-web-app-c664d2505215.herokuapp.com/getBlockByTitle/${name}`;
    const local = `https://localhost:7015/getBlockByTitle/${name}`;

    try {
      const code = await fetch(local, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      });
      console.log(code);
      const dataCode = await code.text();
      console.log(dataCode);
      navigate(`/${name}`, { state: { dataCode, title: name } });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className={s.root}>
        <div>
          <h1>Choose code block</h1>
        </div>

        <div className={s.btn_container}>
          <button className={s.btn_lobby} onClick={Navigator} name="Async-Case">
            Async case
          </button>
          <button
            className={s.btn_lobby}
            onClick={Navigator}
            name="Callback-Hell"
          >
            Callback Hell
          </button>
          <button
            className={s.btn_lobby}
            onClick={Navigator}
            name="Promises-Puzzle"
          >
            Promises Puzzle
          </button>
          <button
            className={s.btn_lobby}
            onClick={Navigator}
            name="Event-Loop-Explained"
          >
            Event Loop Explained
          </button>

          <button
            className={s.btn_lobby}
            onClick={Navigator}
            name="array-methods-mastery"
          >
            Array Methods Mastery
          </button>
        </div>
      </div>
    </>
  );
}
