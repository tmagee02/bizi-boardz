import React, { useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import { getFileContent } from "../backend/tasks/getTask";

const Contact = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getFileContent('USERNAME GO HERE', 'REPO NAME GO HERER', 'task.JSON');
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchData();
  }, []); // The empty array ensures the effect runs only once when the component mounts

  
  return (
    <>
      <p>Contact page content goes here</p>
    </>
  );
};

export default Contact;
