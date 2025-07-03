import React, { useState } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useUser } from "@clerk/clerk-react";
import GlobalApi from "../../../service/GlobalApi";
import { useNavigate } from "react-router-dom";

const AddResume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigation = useNavigate();

  const onCreate = async () => {
    setLoading(true);
    const uuid = uuidv4();
    // console.log(
    //   uuid,
    //   user?.primaryEmailAddress?.emailAddress,
    //   user?.fullName,
    //   title
    // );
    const data = {
      data: {
        title: title,
        resumeId: uuid,
        userMail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };
    GlobalApi.CreateResume(data).then(
      (res) => {
        console.log("Resume created:", res);
        if (res) {
          setTitle("");
          setOpenDialog(false);
          setLoading(false);
          navigation("/dashboard/resume/" + res.data.data.documentId + "/edit");
        }
      },
      (err) => {
        setLoading(false);
        console.log(
          "Error creating resume:",
          err.response?.data || err.message
        );
      }
    );
  };

  return (
    <div>
      <div
        className="p-14 py-24 border flex items-center justify-center bg-secondary rounded-lg h-[280px] hover:scale-110 transition-all hover:shadow-md cursor-pointer border-dashed"
        onClick={() => setOpenDialog(!openDialog)}
      >
        <PlusSquare />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>Add the title for your resume</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.Full Stack Resume"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild onClick={() => setTitle("")}>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <Button onClick={onCreate} disabled={!title || loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
