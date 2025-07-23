import React from "react";
import Header from "./Header";
import { Button } from "../ui/button";

const ViewResume = () => {
  return (
    <div>
      <Header />
      <div>
        <h1 className="text-2xl font-bold text-center my-4">View Resume</h1>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <p className="text-gray-700">
            This is where the resume content will be displayed.
          </p>
          {/* Add resume content here */}
        </div>
        <div>
          <Button className="mt-4" variant="outline">
            Downlode
          </Button>
          <Button className="mt-4 ml-2" variant="outline">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewResume;
