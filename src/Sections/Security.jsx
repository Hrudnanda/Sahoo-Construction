import React, { useEffect, useState } from "react";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound
} from "lucide-react";

const PASSWORD_KEY = "exspot_security_password";
const PASSWORD_BACKUP_KEY = "exspot_security_password_backup";
const LOCK_TIME_KEY = "exspot_auto_lock_time";

// --------------------------------------------------
// DEFAULT USER PASSWORD
// --------------------------------------------------

const DEFAULT_PASSWORD = "1234";

const normalizePassword = (value) =>
  typeof value === "string" ? value.trim() : "";

const readStoredPassword = () => {
  try {
    const primary = normalizePassword(localStorage.getItem(PASSWORD_KEY));
    const backup = normalizePassword(
      localStorage.getItem(PASSWORD_BACKUP_KEY)
    );

    // Recover from the backup if the primary value is missing/corrupted.
    if (primary) return primary;

    if (backup) {
      localStorage.setItem(PASSWORD_KEY, backup);
      return backup;
    }

    return DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
};

const saveStoredPassword = (value) => {
  const safePassword = normalizePassword(value);

  try {
    localStorage.setItem(PASSWORD_KEY, safePassword);
    localStorage.setItem(PASSWORD_BACKUP_KEY, safePassword);
  } catch {
    // Keep the in-memory password working even if browser storage is unavailable.
  }
};

// --------------------------------------------------
// DEVELOPER MASTER PASSWORD
// --------------------------------------------------
// This password can unlock every EXSPOT installation
// using this frontend code.
//
// IMPORTANT:
// For a real production application, do not keep a
// master password directly inside frontend code.
// Use Node.js/Express authentication instead.
// --------------------------------------------------

const DEVELOPER_PASSWORD =
  import.meta.env.VITE_DEVELOPER_PASSWORD || "Hruda@2026";

// --------------------------------------------------
// AUTO LOCK TIME
// --------------------------------------------------
// 10 minutes = 10 * 60 * 1000 milliseconds
// --------------------------------------------------

const AUTO_LOCK_TIME = 10 * 60 * 1000;

export default function Security({ children }) {
  // --------------------------------------------------
  // STATES
  // --------------------------------------------------

  const [password, setPassword] = useState("");

  const [savedPassword, setSavedPassword] = useState(readStoredPassword);

  const [isLocked, setIsLocked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [masterPassword, setMasterPassword] =
    useState("");

  const [resetPassword, setResetPassword] =
    useState("");

  const [confirmResetPassword, setConfirmResetPassword] =
    useState("");

  const [showMasterPassword, setShowMasterPassword] =
    useState(false);

  const [showResetPassword, setShowResetPassword] =
    useState(false);

  const [showConfirmResetPassword, setShowConfirmResetPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  // --------------------------------------------------
  // CHECK AUTO LOCK WHEN PAGE LOADS
  // --------------------------------------------------

  useEffect(() => {
    const lastActivity =
      localStorage.getItem(LOCK_TIME_KEY);

    if (lastActivity) {
      const inactiveTime =
        Date.now() - Number(lastActivity);

      if (inactiveTime < AUTO_LOCK_TIME) {
        // User was recently active
        setIsLocked(false);
      } else {
        // User was inactive for too long
        setIsLocked(true);
      }
    } else {
      // First time opening software
      setIsLocked(true);
    }
  }, []);

  // --------------------------------------------------
  // UPDATE LAST ACTIVITY
  // --------------------------------------------------

  const updateActivity = () => {
    if (!isLocked) {
      try {
        localStorage.setItem(
          LOCK_TIME_KEY,
          Date.now().toString()
        );
      } catch {
        // Ignore storage errors.
      }
    }
  };

  // --------------------------------------------------
  // AUTOMATIC LOCK
  // --------------------------------------------------

  useEffect(() => {
    if (isLocked) return;

    const checkInactivity = () => {
      const lastActivity =
        localStorage.getItem(LOCK_TIME_KEY);

      if (!lastActivity) return;

      const inactiveTime =
        Date.now() - Number(lastActivity);

      if (inactiveTime >= AUTO_LOCK_TIME) {
        setIsLocked(true);
        setPassword("");

        localStorage.removeItem(
          LOCK_TIME_KEY
        );
      }
    };

    const interval = setInterval(
      checkInactivity,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [isLocked]);

  // --------------------------------------------------
  // USER ACTIVITY DETECTION
  // --------------------------------------------------

  useEffect(() => {
    if (isLocked) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click"
    ];

    const handleActivity = () => {
      updateActivity();
    };

    events.forEach((event) => {
      window.addEventListener(
        event,
        handleActivity
      );
    });

    updateActivity();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(
          event,
          handleActivity
        );
      });
    };
  }, [isLocked]);

  // --------------------------------------------------
  // KEEP PASSWORD IN SYNC WITH BROWSER STORAGE
  // --------------------------------------------------

  useEffect(() => {
    const syncPassword = () => {
      const latest = readStoredPassword();
      setSavedPassword(latest);
    };

    window.addEventListener("storage", syncPassword);

    return () => {
      window.removeEventListener("storage", syncPassword);
    };
  }, []);

  // --------------------------------------------------
  // UNLOCK SOFTWARE
  // --------------------------------------------------

  const handleUnlock = () => {
    // Always read the latest password from storage.
    // This prevents an old React state value from causing
    // "Incorrect password" after the app has been open for a long time.
    const latestSavedPassword = readStoredPassword();

    if (latestSavedPassword !== savedPassword) {
      setSavedPassword(latestSavedPassword);
    }

    const enteredPassword = normalizePassword(password);

    // -----------------------------------------------
    // DEVELOPER MASTER PASSWORD
    // -----------------------------------------------

    if (enteredPassword === DEVELOPER_PASSWORD) {
      setIsLocked(false);
      setPassword("");
      setError("");

      try {
        localStorage.setItem(
          LOCK_TIME_KEY,
          Date.now().toString()
        );
      } catch {
        // Ignore storage errors.
      }

      return;
    }

    // -----------------------------------------------
    // NORMAL USER PASSWORD
    // -----------------------------------------------

    if (enteredPassword === latestSavedPassword) {
      setIsLocked(false);
      setPassword("");
      setError("");

      try {
        localStorage.setItem(
          LOCK_TIME_KEY,
          Date.now().toString()
        );
      } catch {
        // Ignore storage errors.
      }
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  // --------------------------------------------------
  // MANUAL LOCK
  // --------------------------------------------------

  const handleLock = () => {
    setIsLocked(true);
    setPassword("");

    try {
      localStorage.removeItem(LOCK_TIME_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  // --------------------------------------------------
  // FORGOT PASSWORD / MASTER PASSWORD RESET
  // --------------------------------------------------

  const handleMasterPasswordReset = () => {
    setError("");

    const enteredMasterPassword =
      normalizePassword(masterPassword);
    const enteredResetPassword =
      normalizePassword(resetPassword);
    const enteredConfirmResetPassword =
      normalizePassword(confirmResetPassword);

    if (
      !enteredMasterPassword ||
      !enteredResetPassword ||
      !enteredConfirmResetPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    // Only the developer/master password can reset a forgotten user password.
    if (enteredMasterPassword !== DEVELOPER_PASSWORD) {
      setError("Master password is incorrect.");
      setMasterPassword("");
      return;
    }

    if (enteredResetPassword.length < 4) {
      setError(
        "New password must be at least 4 characters."
      );
      return;
    }

    if (
      enteredResetPassword !==
      enteredConfirmResetPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    // Save to both primary and backup storage.
    saveStoredPassword(enteredResetPassword);
    setSavedPassword(enteredResetPassword);

    setMasterPassword("");
    setResetPassword("");
    setConfirmResetPassword("");
    setShowForgotPassword(false);
    setError("");

    alert(
      "Password reset successfully. You can now login with your new password."
    );
  };

  // --------------------------------------------------
  // CHANGE USER PASSWORD
  // --------------------------------------------------

  const handleChangePassword = () => {
    setError("");

    const latestSavedPassword = readStoredPassword();
    const enteredCurrentPassword = normalizePassword(currentPassword);
    const enteredNewPassword = normalizePassword(newPassword);
    const enteredConfirmPassword = normalizePassword(confirmPassword);

    // Check empty fields
    if (
      !enteredCurrentPassword ||
      !enteredNewPassword ||
      !enteredConfirmPassword
    ) {
      setError(
        "Please fill all fields."
      );

      return;
    }

    // Developer password cannot be changed
    // through the normal user password screen.
    if (
      enteredCurrentPassword ===
      DEVELOPER_PASSWORD
    ) {
      setError(
        "Developer password cannot be changed here."
      );

      return;
    }

    // Check current user password
    if (
      enteredCurrentPassword !==
      latestSavedPassword
    ) {
      setError(
        "Current password is incorrect."
      );

      return;
    }

    // Minimum password length
    if (enteredNewPassword.length < 4) {
      setError(
        "New password must be at least 4 characters."
      );

      return;
    }

    // Confirm password
    if (
      enteredNewPassword !==
      enteredConfirmPassword
    ) {
      setError(
        "New passwords do not match."
      );

      return;
    }

    // Save new password
    saveStoredPassword(enteredNewPassword);
    setSavedPassword(enteredNewPassword);

    // Clear fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowChangePassword(false);

    alert(
      "Password changed successfully."
    );
  };

  // --------------------------------------------------
  // PASSWORD ENTER KEY
  // --------------------------------------------------

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  // --------------------------------------------------
  // LOCK SCREEN
  // --------------------------------------------------

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4">

        <div className="w-full max-w-md">

          {/* ------------------------------------------------
              LOGO / SECURITY HEADER
          ------------------------------------------------ */}

          <div className="bg-gradient-to-r from-[#00B9F1] to-[#002E6E] rounded-[2.5rem] p-8 shadow-2xl text-center">

            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-5">

              <Lock
                size={38}
                className="text-[#002E6E]"
              />

            </div>

            <h1 className="text-3xl font-black italic text-white">

              EX
              <span className="text-white/70">
                SPOT
              </span>

            </h1>

            <p className="text-white/70 text-sm mt-2">
              Secure Corporate Ledger
            </p>

          </div>

          {/* ------------------------------------------------
              LOGIN CARD
          ------------------------------------------------ */}

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl mt-6">

            <div className="text-center mb-7">

              <div className="flex justify-center mb-3">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <ShieldCheck
                    size={26}
                    className="text-[#00AC4E]"
                  />

                </div>

              </div>

              <h2 className="text-xl font-black text-[#002E6E]">
                Software Locked
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Enter your password to continue
              </p>

            </div>

            {/* ------------------------------------------------
                PASSWORD INPUT
            ------------------------------------------------ */}

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );

                  setError("");
                }}
                onKeyDown={
                  handlePasswordKeyDown
                }
                className="w-full p-4 pr-12 bg-[#F0F7FF] rounded-2xl border border-transparent outline-none focus:border-[#00B9F1] font-bold"
                autoFocus
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

            {/* ------------------------------------------------
                ERROR MESSAGE
            ------------------------------------------------ */}

            {error && (
              <p className="text-red-500 text-xs font-bold mt-3 text-center">
                {error}
              </p>
            )}

            {/* ------------------------------------------------
                UNLOCK BUTTON
            ------------------------------------------------ */}

            <button
              onClick={handleUnlock}
              className="w-full mt-5 py-4 bg-gradient-to-r from-[#00B9F1] to-[#002E6E] text-white rounded-full font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >

              <Unlock size={18} />

              Unlock Software

            </button>

            {/* ------------------------------------------------
                CHANGE PASSWORD
            ------------------------------------------------ */}

            <button
              onClick={() => {
                setShowChangePassword(true);
                setShowForgotPassword(false);
                setError("");
              }}
              className="w-full mt-5 text-xs font-bold text-[#002E6E] hover:text-[#00B9F1]"
            >
              Change Password
            </button>

            <button
              onClick={() => {
                setShowForgotPassword(true);
                setShowChangePassword(false);
                setMasterPassword("");
                setResetPassword("");
                setConfirmResetPassword("");
                setError("");
              }}
              className="w-full mt-3 text-xs font-bold text-gray-500 hover:text-[#00B9F1]"
            >
              Forgot Password? Reset with Master Password
            </button>

            {/* ------------------------------------------------
                SECURITY FOOTER
            ------------------------------------------------ */}

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">

              <p className="text-[10px] text-gray-400 font-medium">
                🔒 Protected by EXSPOT Security
              </p>

            </div>

          </div>

        </div>

        {/* --------------------------------------------------
            FORGOT PASSWORD / MASTER RESET MODAL
        -------------------------------------------------- */}

        {showForgotPassword && (
          <div className="fixed inset-0 bg-[#002E6E]/70 backdrop-blur-sm flex items-center justify-center p-4 z-[600]">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <KeyRound
                    size={24}
                    className="text-[#002E6E]"
                  />
                </div>

                <div>
                  <h2 className="font-black text-[#002E6E] text-lg">
                    Reset Forgotten Password
                  </h2>

                  <p className="text-xs text-gray-400">
                    Use your master password to create a new password
                  </p>
                </div>
              </div>

              <div className="relative mb-3">
                <input
                  type={showMasterPassword ? "text" : "password"}
                  placeholder="Master Password"
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full p-4 pr-12 bg-[#F0F7FF] rounded-2xl outline-none border border-transparent focus:border-[#00B9F1]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowMasterPassword(!showMasterPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showMasterPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="relative mb-3">
                <input
                  type={showResetPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={resetPassword}
                  onChange={(e) => {
                    setResetPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full p-4 pr-12 bg-[#F0F7FF] rounded-2xl outline-none border border-transparent focus:border-[#00B9F1]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowResetPassword(!showResetPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showResetPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type={
                    showConfirmResetPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm New Password"
                  value={confirmResetPassword}
                  onChange={(e) => {
                    setConfirmResetPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleMasterPasswordReset();
                    }
                  }}
                  className="w-full p-4 pr-12 bg-[#F0F7FF] rounded-2xl outline-none border border-transparent focus:border-[#00B9F1]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmResetPassword(
                      !showConfirmResetPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmResetPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4 text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleMasterPasswordReset}
                className="w-full py-4 bg-gradient-to-r from-[#00B9F1] to-[#002E6E] text-white rounded-full font-bold shadow-lg"
              >
                Reset Password
              </button>

              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setMasterPassword("");
                  setResetPassword("");
                  setConfirmResetPassword("");
                  setError("");
                  setShowMasterPassword(false);
                  setShowResetPassword(false);
                  setShowConfirmResetPassword(false);
                }}
                className="w-full mt-4 text-sm font-bold text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* --------------------------------------------------
            CHANGE PASSWORD MODAL
        -------------------------------------------------- */}

        {showChangePassword && (

          <div className="fixed inset-0 bg-[#002E6E]/70 backdrop-blur-sm flex items-center justify-center p-4 z-[500]">

            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <KeyRound
                    size={24}
                    className="text-[#002E6E]"
                  />

                </div>

                <div>

                  <h2 className="font-black text-[#002E6E] text-lg">
                    Change Password
                  </h2>

                  <p className="text-xs text-gray-400">
                    Update your security password
                  </p>

                </div>

              </div>

              {/* CURRENT PASSWORD */}

              <input
                type="password"
                placeholder="Current Password"
                value={
                  currentPassword
                }
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-[#F0F7FF] rounded-2xl mb-3 outline-none border border-transparent focus:border-[#00B9F1]"
              />

              {/* NEW PASSWORD */}

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-[#F0F7FF] rounded-2xl mb-3 outline-none border border-transparent focus:border-[#00B9F1]"
              />

              {/* CONFIRM PASSWORD */}

              <input
                type="password"
                placeholder="Confirm New Password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-[#F0F7FF] rounded-2xl mb-4 outline-none border border-transparent focus:border-[#00B9F1]"
              />

              {/* ERROR */}

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4 text-center">
                  {error}
                </p>
              )}

              {/* CHANGE PASSWORD */}

              <button
                onClick={
                  handleChangePassword
                }
                className="w-full py-4 bg-gradient-to-r from-[#00B9F1] to-[#002E6E] text-white rounded-full font-bold shadow-lg"
              >

                Change Password

              </button>

              {/* CANCEL */}

              <button
                onClick={() => {
                  setShowChangePassword(
                    false
                  );

                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                  setShowMasterPassword(false);
                  setShowResetPassword(false);
                  setShowConfirmResetPassword(false);
                }}
                className="w-full mt-4 text-sm font-bold text-gray-400"
              >

                Cancel

              </button>

            </div>

          </div>

        )}

      </div>
    );
  }

  // --------------------------------------------------
  // UNLOCKED SOFTWARE
  // --------------------------------------------------

  return (
    <div className="relative">

      {/* ------------------------------------------------
          MANUAL LOCK BUTTON
      ------------------------------------------------ */}

      <button
        onClick={handleLock}
        title="Lock Software"
        className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-[#002E6E] text-white shadow-2xl flex items-center justify-center hover:bg-[#00B9F1] transition-all"
      >

        <Lock size={22} />

      </button>

      {/* ------------------------------------------------
          EXISTING SOFTWARE
      ------------------------------------------------ */}

      {children}

    </div>
  );
}