import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const PURCHASE_API = "http://localhost:9999/api/razorpay/";
const PURCHASE_API = "https://hd-learning.onrender.com/api/razorpay/";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ courseId, amount, currency }) => ({
        url: `order/${courseId}`,
        method: "POST",
        body: { amount, currency },
      }),
    }),

    validatePayment: builder.mutation({
      query: ({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }) => ({
        url: "validate",
        method: "POST",
        body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      }),
    }),

    
    getAllPurchasedCourse: builder.query({
      query: () => ({
        url: "all-purchased",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useValidatePaymentMutation,
useGetAllPurchasedCourseQuery
} = purchaseApi;
