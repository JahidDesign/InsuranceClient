// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------------------
// Header with cover + avatar + customer info + logout
// ---------------------------
const ProfileHeader = ({ user, profile, customer, onEdit, onLogout }) => (
  <div className="relative mb-12">
    {/* Cover image */}
    <div className="relative h-56 w-full">
      <img
        src={profile.coverImage || "https://via.placeholder.com/1200x300"}
        alt="Cover"
        className="w-full h-full object-cover rounded-b-3xl"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:scale-105 transition"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:scale-105 transition"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Avatar + Name + Email */}
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 -mt-16 relative z-10 flex flex-col lg:flex-row items-center gap-6">
      <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
        <img
          src={user.photo || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-center lg:text-left space-y-2">
        <h1 className="text-3xl font-bold">{customer?.name || user.name}</h1>
        <p className="text-gray-600">{profile.bio || "No bio available"}</p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            📧 {customer?.email || user.email}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            📱 {profile.phone || "No phone"}
          </span>
        </div>
        <div className="flex gap-3 mt-2 justify-center lg:justify-start">
          {profile.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              LinkedIn
            </a>
          )}
          {profile.socialLinks?.facebook && (
            <a
              href={profile.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              Twitter
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ---------------------------
// About Me Section
// ---------------------------
const AboutMe = ({ bio }) => (
  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
    <h2 className="text-2xl font-bold mb-2">About Me</h2>
    <p className="text-gray-700">{bio || "No description available"}</p>
  </div>
);

// ---------------------------
// Quick Stats Section
// ---------------------------
const QuickStats = ({ profile, user }) => (
  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-2">
    <h3 className="text-xl font-bold mb-2">Quick Stats</h3>
    <div className="flex justify-between">
      <span>Role:</span> <b>{user.role || "N/A"}</b>
    </div>
    <div className="flex justify-between">
      <span>Status:</span> <b>{user.status || "N/A"}</b>
    </div>
    <div className="flex justify-between">
      <span>Joined:</span>{" "}
      <b>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</b>
    </div>
    <div className="flex justify-between">
      <span>Age:</span> <b>{profile.age || "N/A"}</b>
    </div>
    <div className="flex justify-between">
      <span>Experience:</span> <b>{profile.experience || "N/A"} years</b>
    </div>
  </div>
);

// ---------------------------
// Edit Profile Form Modal
// ---------------------------
const ProfileUpdateForm = ({ profile, userId, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    bio: profile.bio || "",
    phone: profile.phone || "",
    coverImage: profile.coverImage || "",
    linkedin: profile.socialLinks?.linkedin || "",
    facebook: profile.socialLinks?.facebook || "",
    twitter: profile.socialLinks?.twitter || "",
    age: profile.age || "",
    experience: profile.experience || "",
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId,
        bio: form.bio,
        phone: form.phone,
        coverImage: form.coverImage,
        socialLinks: {
          linkedin: form.linkedin,
          facebook: form.facebook,
          twitter: form.twitter,
        },
        age: form.age ? Number(form.age) : null,
        experience: form.experience ? Number(form.experience) : null,
      };

      const res = await fetch("https://insurances-lmy8.onrender.com/policiesuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Submit failed: ${res.status}`);
      }

      const saved = await res.json();
      toast.success("Profile updated successfully!");
      onUpdated(saved);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>

        {step === 1 && (
          <>
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <label className="block mb-2">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <label className="block mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <label className="block mb-2">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-2">Cover Image URL</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
          </>
        )}

        {step === 3 && (
          <>
            <label className="block mb-2">LinkedIn</label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <label className="block mb-2">Facebook</label>
            <input
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <label className="block mb-2">Twitter</label>
            <input
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
          </>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Previous
          </button>
          {step < 3 ? (
            <button type="button" onClick={handleNext} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Save
            </button>
          )}
        </div>

        <button type="button" onClick={onClose} className="mt-3 text-gray-500 underline">
          Cancel
        </button>
      </form>
    </div>
  );
};

// ---------------------------
// Main Profile Component
// ---------------------------
const Profile = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/policiesuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id || user.id }),
        });
        const data = await res.json();
        setProfile(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        toast.error("Failed to fetch profile.");
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch customer info
  useEffect(() => {
    if (!user) return;
    const fetchCustomer = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/customer");
        const data = await res.json();
        const cust = Array.isArray(data) ? data.find((c) => c.email === user.email) : data;
        setCustomer(cust || null);
      } catch (err) {
        toast.error("Failed to fetch customer info.");
      }
    };
    fetchCustomer();
  }, [user]);

  if (loading) return <p className="p-6 text-gray-600">Loading profile...</p>;
  if (!user) return <p className="p-6 text-red-500">You must login to view your profile.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto px-4">
        {profile && (
          <ProfileHeader
            user={user}
            profile={profile}
            customer={customer}
            onEdit={() => setEditing(true)}
            onLogout={logout}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <AboutMe bio={profile?.bio} />
          </div>
          <div>
            <QuickStats profile={profile} user={user} />
          </div>
        </div>
      </div>

      {editing && (
        <ProfileUpdateForm
          profile={profile || {}}
          userId={user._id || user.id}
          onClose={() => setEditing(false)}
          onUpdated={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
};

export default Profile;
