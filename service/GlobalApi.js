import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const CreateResume = (data) => axiosClient.post("/user-resumes", data);

const GetUserResumes = (userMail) =>
  axiosClient.get(
    `/user-resumes?filters[userMail][$eq]=${encodeURIComponent(userMail)}`
  );

const UpdateResumeDetails = (id, data) =>
  axiosClient.put("/user-resumes/" + id, data);

const GetResumeBuId = (id) => axiosClient.get(`/user-resumes/${id}?populate=*`);

export default {
  CreateResume,
  GetUserResumes,
  UpdateResumeDetails,
  GetResumeBuId,
};
