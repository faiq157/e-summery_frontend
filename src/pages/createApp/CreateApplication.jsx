import { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Dashboardlayout from '@/layout/Dashboardlayout';
import axios from 'axios';
import { Button } from "@/components/ui/button";

const CreateApplication = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const storedToken = localStorage.getItem('token');

  const TextInput = ({ label, name, type = "text", ...rest }) => (
    <div className="mb-4">
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
    <div className="mb-4">
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
    setSubmittedData(null);  // Optionally clear the submitted data
  };

  return (
    <Dashboardlayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Create Application</h1>
        <div className="bg-card shadow-md rounded-lg p-6">
          <Formik
            initialValues={{
              description: '',
              subject: '',
              userName: '',
              email: '',
              contact_number: '',
              status: 'Pending',
              file: null,
            }}
            onSubmit={(values, { setSubmitting }) => {
              const formData = new FormData();
              formData.append('description', values.description);
              formData.append('subject', values.subject);
              formData.append('userName', values.userName);
              formData.append('email', values.email);
              formData.append('contact_number', values.contact_number);
              formData.append('status', values.status);
              formData.append('image', values.file);

              axios.post('http://localhost:5000/api/notesheet/create', formData)
                .then((response) => {
                  console.log('Success:', response.data);
                  setSubmitting(false);
                  setSubmittedData(values);  // Save the form values in state
                  setIsModalOpen(true);  // Open the modal
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
                <TextInput label="Email" name="email" type="email" />
                <TextInput label="Contact Number" name="contact_number" />
                <TextInput label="Subject" name="subject" />
                <TextInput label="Description" name="description" as="textarea" />
                <FileInput label="Upload File" name="file" setFieldValue={setFieldValue} />
                <div className="mt-6 flex justify-between">
                  <Button type="submit" disabled={isSubmitting}>Submit</Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Submitted Data</h2>
            <div className="mb-2"><strong>Name:</strong> {submittedData?.userName}</div>
            <div className="mb-2"><strong>Email:</strong> {submittedData?.email}</div>
            <div className="mb-2"><strong>Contact Number:</strong> {submittedData?.contact_number}</div>
            <div className="mb-2"><strong>Subject:</strong> {submittedData?.subject}</div>
            <div className="mb-2"><strong>Description:</strong> {submittedData?.description}</div>
            <div className="mb-2"><strong>Status:</strong> {submittedData?.status}</div>

            <div className="mt-4">
              <Button onClick={handleModalClose}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </Dashboardlayout>
  );
};

export default CreateApplication;
