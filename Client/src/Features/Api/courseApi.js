import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const COURSE_API = "http://localhost:9999/api/course/";
const COURSE_API = "https://hd-learning.onrender.com/api/course/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  //tagtypes used to reload the api
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "create",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
    }),

    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `update/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `${courseId}`,
        method: "GET",
      }),
    }),

    getCourseDetailsWithPaymentStatus: builder.query({
      query: (courseId) => ({
        url: `${courseId}/details-with-status`,
        method: "GET",
      }),
    }),


    // Lecture
    createLecture: builder.mutation({
      query: ({ courseId, lectureTitle }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),

    getCourseLecture: builder.query({
      query: ({ courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({
        courseId,
        lectureId,
        lectureTitle,
        videoInfo,
        isPreviewFree,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),
    removeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),

    getSearchCourses: builder.query({
      query: ({ query, categories, sortByPrice }) => {
        // build query string
        let queryString = `search?query=${encodeURIComponent(query)}`;
        //append category
        if (categories && categories.length > 0) {
          const categoriesString = categories
            ?.map(encodeURIComponent)
            .join(",");

          queryString += `&categories=${categoriesString}`
        }

        // append sortByPrice if aavailable
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`
        }

        return{
          url: queryString,
          method: "GET"
        }
      },
    }),

    // Publish
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useGetCourseDetailsWithPaymentStatusQuery,
  // useGetAllPurchasedCourseQuery,
  useGetSearchCoursesQuery,
} = courseApi;
