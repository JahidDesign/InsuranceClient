// File: src/components/Navbar.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Home,
  Info,
  FileText,
  BookOpen,
  Mail,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "All Policies", path: "/allpolicies", icon: FileText },
  { name: "Blog", path: "/blog", icon: BookOpen },
  { name: "Contact", path: "/contact", icon: Mail },
];

const Navbar = () => {
  const { user, logout, role } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const isAdmin = role === "admin";

  const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Spacer */}
      <div className="h-20"></div>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/70 backdrop-blur-lg shadow-lg border-b border-white/20"
            : "bg-white/50 backdrop-blur-xl shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group relative">
            <img
              src="insurancen.svg"
              alt="LifeSecure"
              className="w-36 h-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                to={path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-500 ${
                  location.pathname === path
                    ? "bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-white/50 hover:shadow-lg hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" /> {name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-red-600 hover:bg-red-50 hover:shadow-lg transition-all duration-500"
              >
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-full hover:bg-white/50 hover:shadow-lg transition duration-500"
                >
                  <img
                    src={photoURL}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="font-semibold text-gray-800">
                      {displayName}
                    </div>
                    <div className="text-xs text-green-500 font-semibold">
                      ● Online
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/30 rounded-3xl py-3 z-50 overflow-hidden animate-fadeIn">
                    <div className="px-5 py-4 border-b border-gray-100/50 flex items-center gap-4">
                      <img
                        src={photoURL}
                        alt="avatar"
                        className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-lg">
                          {displayName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-4 w-full px-5 py-3 text-gray-700 hover:bg-blue-50 rounded-2xl transition-all duration-300"
                    >
                      <User className="w-4 h-4 text-blue-600" /> Profile
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-4 w-full px-5 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 text-red-600" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-3 rounded-full bg-white/50 hover:bg-white/80 hover:shadow-lg transition duration-500"
            onClick={() => setSideMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Side Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-500 ${
            sideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <Link to="/" className="font-bold text-xl">
              LifeSecure
            </Link>
            <button onClick={() => setSideMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setSideMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  location.pathname === path
                    ? "bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:shadow-lg hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" /> {name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setSideMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-red-600 hover:bg-red-50 hover:shadow-lg transition-all duration-300"
              >
                <Shield className="w-5 h-5" /> Admin Panel
              </Link>
            )}

            {user && (
              <div className="mt-6 border-t border-white/20 pt-4 space-y-3">
                <div className="flex items-center gap-4 py-3 bg-white/30 backdrop-blur-md rounded-2xl">
                  <img
                    src={photoURL}
                    alt="avatar"
                    className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{displayName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-green-500 font-semibold">● Online</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setSideMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  <User className="w-5 h-5 text-blue-600" /> Profile Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setSideMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-2xl hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 text-red-600" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
