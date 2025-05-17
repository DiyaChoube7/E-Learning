import { useGetCourseDetailsWithPaymentStatusQuery } from "@/Features/Api/courseApi"
import { Navigate, useParams } from "react-router-dom"

const PurchasedCourseProtectedRoute = ({children}) => {
  const {courseId} = useParams()
  const {data, isLoading} = useGetCourseDetailsWithPaymentStatusQuery(courseId)

  if(isLoading){
    return <p>Loading...</p>
  }

  return data?.purchased ? children : <Navigate to={`/course-details/${courseId}`}/>
}

export default PurchasedCourseProtectedRoute
