// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white-200 ">
//       <Card className="w-full max-w-md shadow-lg shadow-black bg-slate-50">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center py-1">Login Form</CardTitle>
//           <CardDescription className="text-center">
//             Enter your information
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} noValidate  className="space-y-4  p-4 ">
//             {error && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="example@gmail.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 dir="ltr"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 dir="ltr"
//               />
//             </div>

//             <Button type="submit" className="w-full " disabled={loading}>
//               {loading ? "At the time of enter" : "Enter"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // پاک کردن خطای قبلی

    // ۱. اعتبارسنجی سمت فرانت‌اند (چک کردن خالی نبودن)
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    // ۲. درخواست به بک‌اند
    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard"); // هدایت به داشبورد بعد از لاگین موفق
    } catch (err) {
      // خطایی که از api.js میاد (مثلاً رمز اشتباه)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
        
        {/* هدر فرم */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Login Form</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your information</p>
        </div>

        {/* نمایش خطا */}
        {error && (
          <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-md text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {/* فرم لاگین */}
        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-50"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Enter"}
          </Button>
        </form>
        
      </div>
    </div>
  );
}