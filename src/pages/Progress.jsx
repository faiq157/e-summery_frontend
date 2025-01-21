import { useState, useEffect } from 'react';
import Dashboardlayout from '@/layout/Dashboardlayout';
import NotesheetCardList from '@/components/NotesheetCardList';

const Progress = () => {
  const [storedEmail, setStoredEmail] = useState('');
  const storedUser = localStorage.getItem('user');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    // Fetch the email from the stored user object
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      setStoredEmail(userObject.email || ''); // Set the email if it exists
      setUserRole(userObject.role || '');
    }
  }, [storedUser]);
  console.log("this is user role id", userRole)

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <Dashboardlayout>
      <div className="p-8">
        {/* Create Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold mb-6">Progress Application</h1>
          <div className='flex justify-end gap-4 items-center'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notesheets by subject..."
              className="w-96 p-2 border rounded-md shadow-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-8">
          <NotesheetCardList status={"In Progress"} searchQuery={searchQuery} userRole={userRole} />
        </div>
      </div>

    </Dashboardlayout>
  );
};

export default Progress;
