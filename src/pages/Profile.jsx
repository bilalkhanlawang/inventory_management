import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound } from "lucide-react";

export default function Profile () {
    const {user , setUser} = useAuth();

    const [profileData , setProfileData] = useState({
        name:user?.name,
        email:user?.email,
    });

     const [savingProfile, setSavingProfile] = useState(false);
    const [message , setMessage] = useState({type: "" , text: ""});

    const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const [savingPassword, setSavingPassword] = useState(false);



    function showMessage (type , text) {
        setMessage({type , text});
        setTimeout(() => setMessage({type: "" , text: ""}), 3500);
    }

    function handleProfileChange (profile) {
        const { name , value} = profile.target;
        setProfileData((pre) => ({...pre , [name]: value}));
    }




async function handleProfileSave(e) {
  e.preventDefault();
//   console.log("1. START");
//   console.log("2. profileData:", profileData);

  try {
    setSavingProfile(true);
    console.log("3. Before API");

    const res = await api.patch("/auth/updateMe", profileData);
    // console.log("4. After API. res =", res);

    const updatedUser = { ...user, ...res.data.user };
    // console.log("5. updatedUser =", updatedUser);

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    // console.log("6. saved");

    showMessage("success", "Profile updated successfully");
    // console.log("7. success message");
  } catch (err) {
    // console.error("ERROR:", err);
    // console.error("ERROR MESSAGE:", err.message);
    showMessage("error", err.message);
  } finally {
    setSavingProfile(false);
    // console.log("8. DONE");
  }
}

// change password

function handlePasswordChange (e) {
    const { name , value } = e.target;
    setPasswordData((pre) => ({...pre , [name]: value}));
}

async function handlePasswordSave (e) {
    e.preventDefault();
    try {
        setSavingPassword(true);
        const res = await api.patch("/auth/updateMyPassword" , passwordData);
        setPasswordData({
            currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
        });
        showMessage("successful" , "password change successfuly");
    }catch (err) {
        showMessage("Error:" + err.message);
    }finally {
        setSavingPassword(false);
    }
}



    if (!user) {
        return <div className="text-gray-500">loading...</div>
    }


    return (
          
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-md text-sm border ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name?.trim()?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Personal Information
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>

          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
      <div className="bg-white rounded-lg border shadow-sm p-6">
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <KeyRound className="w-5 h-5" /> Change Password
  </h3>

  <form onSubmit={handlePasswordSave} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="currentPassword">Current Password</Label>
      <Input
        id="currentPassword"
        name="currentPassword"
        type="password"
        value={passwordData.currentPassword}
        onChange={handlePasswordChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="newPassword">New Password</Label>
      <Input
        id="newPassword"
        name="newPassword"
        type="password"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        required
        minLength={6}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="newPasswordConfirm">Confirm New Password</Label>
      <Input
        id="newPasswordConfirm"
        name="newPasswordConfirm"
        type="password"
        value={passwordData.newPasswordConfirm}
        onChange={handlePasswordChange}
        required
        minLength={6}
      />
    </div>

    <Button type="submit" disabled={savingPassword}>
      {savingPassword ? "Updating..." : "Update Password"}
    </Button>
  </form>
</div>
    </div>
    )
}