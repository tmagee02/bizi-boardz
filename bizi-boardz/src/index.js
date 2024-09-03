import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/index.css";
import "./styles/App.css";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login";
import CurrentSprint from "./pages/CurrentSprint.js";
import ViewBacklog from "./pages/ViewBacklog.js";
import MyTasks from "./pages/MyTasks.js";
import Settings from "./pages/Settings.js";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AuthProvider from "./providers/AuthProvider.js";
import TaskProvider from "./providers/TaskProvider.js";
import { useAuthUtils } from "./backend/octokit/useAuthUtils.js";
import { DndProvider } from  "react-dnd";
import { HTML5Backend } from  "react-dnd-html5-backend";

const rootElement = document.getElementById("root");


const App = () => {
  const { isAuthenticated } = useAuthUtils();

  return (

    <BrowserRouter>
      <>
        <NavigationBar />
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path="/">
              <Route index element={isAuthenticated ? <Navigate to="/currentSprint" replace /> : <Login />} />
              <Route path="/currentSprint" element={<CurrentSprint />} />
              <Route path="/viewBacklog" element={<ViewBacklog />} />
              <Route path="/myTasks" element={<MyTasks />} />
              <Route path="/settings" element={<Settings />} />
              
            </Route>
          </Routes>
        </DndProvider>
      </>
    </BrowserRouter>


  );
}

ReactDOM.createRoot(rootElement).render(
  //<React.StrictMode>
  <AuthProvider>
    <TaskProvider>
      <App />
    </TaskProvider>
  </AuthProvider>
  // </React.StrictMode>
);