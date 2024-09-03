import "../styles/ViewBacklog.css";
import BacklogSection from "../components/BacklogSection.js";
import PopupNewTask from "../components/PopupNewTask";
import PopupStartSprint from "../components/PopupStartSprint.js";
import { useAuthUtils } from "../backend/octokit/useAuthUtils.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faBullseye } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { useState } from "react";

export default function ViewBacklog() {
  const [startSprintPopup, setStartSprintPopup] = useState(false);
  const [newTaskPopup, setNewTaskPopup] = useState(false);
  const { activeRepo } = useAuthUtils();

  useEffect(() => {
    console.log("View backlog mounted");
  });

  return (
    <>
      <div className="pageViewBacklog">
        <div className="backlogHeader">
          {activeRepo}
          <div className="headerButtons">
            <button
              className="btnNewSprint"
              onClick={() => setStartSprintPopup(true)}
            >
              <FontAwesomeIcon
                icon={faPersonRunning}
                style={{ paddingRight: "4px" }}
              />
              New Sprint
            </button>
            <button
              className="btnNewTask"
              onClick={() => setNewTaskPopup(true)}
            >
              <FontAwesomeIcon
                icon={faBullseye}
                style={{ paddingRight: "4px" }}
              />
              New Task
            </button>
          </div>
        </div>
        <div className="backlogBody">
          <div className="leftBody">
            <BacklogSection sectionHeader="Backlog" />
          </div>
          <div className="rightBody">
            <BacklogSection sectionHeader="This Sprint" />
            <BacklogSection sectionHeader="Upcoming Sprint" />
          </div>
        </div>
      </div>
      <PopupStartSprint
        trigger={startSprintPopup}
        setTrigger={setStartSprintPopup}
      />
      <PopupNewTask trigger={newTaskPopup} setTrigger={setNewTaskPopup} />
    </>
  );
}
