import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/Features/Api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [signUpInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
    contact : ""
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: isRegisterLoading,
      isSuccess: isRegsiterSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: isLoginLoading,
      isSuccess: isLoginSuccess,
    },
  ] = useLoginUserMutation();

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signUp") {
      setSignUpInput({
        ...signUpInput,
        [name]: value,
      });
    } else {
      setLoginInput({
        ...loginInput,
        [name]: value,
      });
    }
    console.log(name, " : ", value);
    e.preventDefault();
  };

  const handleSubmit = async (type) => {
    const payload = type === "signUp" ? signUpInput : loginInput;
    console.log(payload);
    // using RTK Query fo the API's handling
    // it is basicallly used to prevent the unneccessary api calls and it is done with the redux
    const action = type === "signUp" ? registerUser : loginUser;
    await action(payload);
  };

  useEffect(() => {
    if (isRegsiterSuccess && registerData) {
      toast.success(registerData?.message || "User Registered Successfully");
    }
    if (isLoginSuccess && loginData) {
      toast.success(loginData?.message || "Logged In Successfully");
      navigate("/")
    }
    if (registerError) {
      toast.error(registerError.data?.message || "Error Occured");
    }
    if (loginError) {
      toast.error(loginError.data?.message || "Error Occured");
    }
  }, [
    isLoginLoading,
    isRegisterLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="Sign Up">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={signUpInput.name}
                  placeholder="Shinchan"
                  required="true"
                  onChange={(e) => handleInputChange(e, "signUp")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={signUpInput.email}
                  placeholder="demo1@gmail.com"
                  required="true"
                  onChange={(e) => handleInputChange(e, "signUp")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="contact"
                  name="contact"
                  value={signUpInput.contact}
                  placeholder="1111 111 111"
                  required="true"
                  onChange={(e) => handleInputChange(e, "signUp")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={signUpInput.password}
                  placeholder="Password"
                  required="true"
                  onChange={(e) => handleInputChange(e, "signUp")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  handleSubmit("signUp");
                }}
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please wait
                    </Loader2>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={loginInput.email}
                  placeholder="demo1@gmail.com"
                  required="true"
                  onChange={(e) => handleInputChange(e, "login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={loginInput.password}
                  placeholder="Password"
                  required="true"
                  onChange={(e) => handleInputChange(e, "login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  handleSubmit("login");
                }}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please wait
                    </Loader2>
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
