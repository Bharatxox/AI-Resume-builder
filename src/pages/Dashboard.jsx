import React, { useEffect, useState } from "react";
import AddResume from "../components/custom/AddResume";
import GlobalApi from "../../service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import ResumeCardItem from "../components/custom/ResumeCardItem";

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    userEmail && GetResumeList();
  }, [userEmail]);

  const GetResumeList = () => {
    GlobalApi.GetUserResumes(userEmail).then((res) => {
      setResumeList(res.data.data);
      console.log(res.data.data);
    });
  };
  return (
    <div className="">
      <div className="p-10 md:px-20 lg:px-32">
        <div className="">
          <h2 className="font-bold text-3xl">My resume</h2>
          <p>Start Creating AI resume for your next Job ri+ole</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <AddResume />
          {resumeList.length &&
            resumeList.map((resume, index) => (
              <ResumeCardItem resume={resume} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
