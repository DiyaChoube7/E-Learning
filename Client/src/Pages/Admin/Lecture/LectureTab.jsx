import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/Features/Api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const [title, setTitle] = useState("");
  const [uploadMediaInfo, setUploadMediaInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDissable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  // const MEDIA_API = "http://localhost:9999/api/media/upload-video";
  const MEDIA_API = "https://hd-learning.onrender.com/api/media/upload-video";

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeLectureData,
      isLoading: isLectureRemoveLoading,
      isSuccess: isLectureRemoveSuccess,
      isError,
    },
  ] = useRemoveLectureMutation();

  const fileChnageHandler = async (e) => {
    const file = e.target?.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(MEDIA_API, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        console.log("media result:->", res);
        if (res.data?.success) {
          setUploadMediaInfo({
            videoUrl: res.data.data?.url,
            publicId: res.data.data?.public_id,
          });
          setBtnDissable(false);

          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video Uplaod Failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    console.log("isFree", isFree)
    editLecture({
      lectureTitle: title,
      videoInfo: uploadMediaInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    removeLecture({ courseId, lectureId });
  };

  const {data: lectureData} = useGetLectureByIdQuery(lectureId)
  const lecture = lectureData?.lecture

  useEffect(()=> {
    if(lecture){
        setTitle(lecture.lectureTitle)
        setIsFree(lecture?.isPreviewFree)
        setUploadMediaInfo(lecture?.videoInfo)
    }
  }, [lecture])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture Updated Successfully !!");
    }
    if (isLectureRemoveSuccess) {
      toast.success(
        removeLectureData?.message || "Lecture Remove Successfully !!"
      );
    }
    if (error) {
      toast.error(error?.data?.message || "Error Occured !!");
    }
    if (isError) {
      toast.error(
        error?.removeLectureData?.message ||
          "Error Occured in Remove Lecture !!"
      );
    }
  }, [isSuccess, error, isLectureRemoveSuccess, isError]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when you done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"destructive"}
            onClick={removeLectureHandler}
            disabled={isLectureRemoveLoading}
          >
            {isLectureRemoveLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input
            type={"text"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Introduction"
          />
        </div>
        <div className="flex flex-col gap-2 my-5">
          <Label>
            Video<span className="text-red-600 font-bold">*</span>
          </Label>
          <Input
            type={"file"}
            accept={"video/*"}
            onChange={fileChnageHandler}
            placeholder="Ex. Introduction"
            className={"w-fit"}
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Label htmlFor="isFree">Is This Video Will be Free ?</Label>
          <Switch
            id="isFree"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploading...</p>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={editLectureHandler} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2
                  className="mr-2 w-4 h-4 animate-spin"
                />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
