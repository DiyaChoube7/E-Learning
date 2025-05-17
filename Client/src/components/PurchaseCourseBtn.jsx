import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "@/Features/Api/courseApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useCreateOrderMutation, useValidatePaymentMutation } from "@/Features/Api/purchaseApi";
import { Loader2 } from "lucide-react";

const PurchaseCourseBtn = ({ refetch }) => {
  const navigate = useNavigate()
  const [razorpayKey, setRazorpayKey] = useState("");
  const params = useParams();
  const { courseId } = params;
  const [userFilledNameOnRazorpay, setUserFilledNameOnRazorpay] = useState(" ")

  const {
    data: courseData,
    isLoading: courseDataIsLoading,
    isSuccess: courseDataIsSuccess,
    isError: courseDataIsError,
  } = useGetCourseByIdQuery(courseId);

  const [
    createOrder,
    { data: orderData, isLoading: orderCreateLoading, isSuccess, error },
  ] = useCreateOrderMutation();
  const [
    validatePayment,
    { data: validate, isLoading: validateLoading, isSuccess: validateSuccess, error: validateError },
  ] = useValidatePaymentMutation();

  const { user } = useSelector((store) => store.auth);
  
  // console.log("user", user)

  useEffect(() => {
    // fetch("http://localhost:9999/api/config/razorpay") // Adjust based on your backend URL
    fetch("https://hd-learning.onrender.com/api/config/razorpay") // Adjust based on your backend URL
      .then((res) => res.json())
      .then((data) => {
        setRazorpayKey(data.key);
        // console.log("Using Razorpay Key:", data.key);
      })
      .catch((err) => console.error("Error fetching Razorpay key:", err));
  }, []);

  const amount = courseData?.course?.coursePrice; // its aways in paise, it means it just a 123 paise 1.23 rupees
  const currency = "INR";

  const handlePurchase = async (event) => {
    // alert("Working")
    // const res = await fetch(
    //   `http://localhost:9999/api/razorpay/order/${courseId}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include", // This ensures the cookie is sent with the request
    //     body: JSON.stringify({
    //       amount: amount*100, // convert in rupees
    //       currency,
    //     }),
    //   }
    // );

    const orderResponse = await createOrder({
      courseId,
      amount: amount * 100,
      currency,
    });

    // const order = await res.json();
    console.log("order", orderResponse);

    var option = {
      key: razorpayKey,
      amount: amount * 100, // convert in rupees
      currency,
      name: "HD-Learning", // company name that shows in the razorpay component
      description: "Test Transaction",
      image:
        "https://tse4.mm.bing.net/th?id=OIP.NUnJtiDFWXZTd1QptrMEIgHaHa&pid=Api&P=0&h=220",
      order_id: orderResponse?.data?.order?.id,
      handler: async (res) => {
        try {
          const validationResponse = await validatePayment(res).unwrap();

          console.log("validationResponse", validationResponse)

          if (validationResponse?.success) {
            toast.success("Purchase successful!");
            window.location.href = validationResponse?.success_url
            refetch();
          } else {
            toast.error("Payment validation failed.");
          }
        } catch (err) {
          console.error("Validation error:", err);
          toast.error("Something went wrong during payment validation.");
        }
        // alert("Transaction Successfull !!")
        // const body = { ...res };
        // const validateResponse = await fetch(
        //   "http://localhost:9999/api/razorpay/validate",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     credentials: "include", // This ensures the cookie is sent with the request
        //     body: JSON.stringify(body),
        //   }
        // );

        // const jsonResponse = await validateResponse.json();
        // console.log("jsonResponse", jsonResponse);
        // if (jsonResponse.success) {
        //   toast.success("Purchase successful!");
        //   refetch(); // Refetch course data after successful purchase
        // } else {
        //   toast.error("Payment validation failed");
        // }
      },
      prefill: {
        // user filled data
        name: user?.name,
        email: user?.email,
        contact: user?.contact || 0,
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new Razorpay(option);
    rzp1.on("payment.failed", (res) => {
      toast.error(res?.error?.reason || "Payment failed.");
    });

    console.log("status", orderResponse?.data?.order);
    if (orderResponse?.data?.success) {
      rzp1.open();
    } else {
      toast.error(orderResponse?.data?.message);
    }
    event.preventDefault();
  };

  return (
    <Button
      className={"w-full"}
      disabled={orderCreateLoading}
      onClick={handlePurchase}
    >
      {orderCreateLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default PurchaseCourseBtn;
