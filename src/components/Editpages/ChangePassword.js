import React, { useState } from 'react';
import { useNavigate } from 'react-router';
function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and Confirm password don't match");
      return;
    }

    // Your logic to handle password change goes here

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    navigate("/loginandsecurity")
    console.log(confirmPassword);
  };

  return (
    <div className="container mx-auto max-w-md my-3 mb-4 my-5 mt-8">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <div className="border rounded ">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className=" my-2 mx-3 block mb-1">Current Password:</label>
            <div className="row">
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 mx-4 col-6  border border-gray-300 rounded  "
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mx-3 mb-1">New Password:</label>
            <div className="row">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mx-4  col-6 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mx-3 mb-1">Re-enter New Password:</label>
            <div className="row ">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mx-4 col-6  border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
              />
            </div>
          </div>
          {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
          <div className="mb-4">
            <button type="submit" className="px-4 py-2 mx-3 bg-blue-800 text-black rounded hover">
              Submit
            </button>
            <button className="px-4 py-2 mx-3 bg-blue-800 text-black rounded hover">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
