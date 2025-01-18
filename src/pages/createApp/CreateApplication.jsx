import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Dashboardlayout from '@/layout/Dashboardlayout';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import NotesheetCardList from '@/components/NotesheetCardList';

const CreateApplication = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [storedEmail, setStoredEmail] = useState('');
  const storedToken = localStorage.getItem('token');
  const base_URL = import.meta.env.VITE_APP_API_URL;
  const storedUser = localStorage.getItem('user');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refetchData, setRefetchData] = useState(false); // State to trigger re-fetch

  useEffect(() => {
    // Fetch the email from the stored user object
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      setStoredEmail(userObject.email || ''); // Set the email if it exists
      setUserRole(userObject.role || '');
    }
  }, [storedUser]);

  const TextInput = ({ label, name, type = "text", ...rest }) => (
    <div className="mb-2">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <Field
        type={type}
        name={name}
        id={name}
        className="shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...rest}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
    </div>
  );

  const FileInput = ({ label, name, setFieldValue }) => (
    <div className="mb-2">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        type="file"
        name={name}
        id={name}
        onChange={(event) => setFieldValue(name, event.currentTarget.files[0])}
        className="shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
    </div>
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSubmittedData(null); // Optionally clear the submitted data
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to trigger data re-fetch after form submission
  const handleRefetchData = () => {
    setRefetchData((prev) => !prev); // Toggle the state to trigger re-fetch
  };

  return (
    <Dashboardlayout>
      <div className="p-8">
        {/* Create Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold mb-6">Create Application</h1>
          <div className='flex justify-end gap-4 items-center'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notesheets by subject..."
              className="w-96 p-2 border rounded-md shadow-sm focus:outline-none"
            />
            <Button onClick={() => setIsModalOpen(true)}>Create</Button>
          </div>
        </div>

        {/* Show the list of created notesheets (could be fetched from an API or static data) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Created Notesheets</h2>
          <NotesheetCardList searchQuery={searchQuery} userRole={userRole} refetchData={refetchData} />
        </div>
      </div>

      {/* Modal for the form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[60vw] h-[90vh] overflow-auto">
            <div className='flex justify-between'>
              <h2 className="text-2xl font-bold mb-4">Create New Application</h2>
              <AiOutlineClose onClick={handleModalClose} />
            </div>

            <Formik
              initialValues={{
                description: '',
                subject: '',
                userName: '',
                email: storedEmail, // Automatically prepopulate email
                contact_number: '',
                userEmail: '',
                status: 'Pending',
                file: null,
              }}
              enableReinitialize={true} // Ensures email is updated when fetched
              onSubmit={(values, { setSubmitting, resetForm }) => {
                const formData = new FormData();
                formData.append('description', values.description);
                formData.append('subject', values.subject);
                formData.append('userName', values.userName);
                formData.append('email', values.email);
                formData.append('contact_number', values.contact_number);
                formData.append('userEmail', values.userEmail);
                formData.append('status', values.status);
                formData.append('image', values.file);

                axios.post(`${base_URL}/notesheet/create`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: ` ${storedToken}`,
                  },
                })
                  .then((response) => {
                    console.log('Success:', response.data);
                    resetForm();
                    setSubmitting(false);
                    setSubmittedData(values); // Save the form values in state
                    setIsModalOpen(false); // Close the modal after submission

                    // Trigger refetch data after submission
                    handleRefetchData();
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                    setSubmitting(false);
                  });
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <TextInput label="Name" name="userName" />
                  <TextInput label="Contact Number" name="contact_number" />
                  <TextInput label="User Email" name="userEmail" />
                  <TextInput label="Subject" name="subject" />
                  <TextInput label="Description" name="description" as="textarea" />
                  <FileInput label="Upload File" name="file" setFieldValue={setFieldValue} />
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>Submit</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </Dashboardlayout>
  );
};

export default CreateApplication;
