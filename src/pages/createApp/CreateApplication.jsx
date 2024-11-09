import { Formik, Form, Field, ErrorMessage } from 'formik';
import Dashboardlayout from '@/layout/Dashboardlayout';

const CreateApplication = () => {
  return (
    <Dashboardlayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Create Application</h1>
        <div className="bg-card shadow-md rounded-lg p-6">
          <Formik
            initialValues={{ email: '', description: '' }}
            onSubmit={(values, { setSubmitting }) => {
              // Here you would handle form submission, e.g., send data to API
              console.log(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                    Name
                  </label>
                  <Field
                    type="name"
                    name="name"
                    id="name"
                    className={`shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
                   `}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">
                    Subject
                  </label>
                  <Field
                    type="subject"
                    name="subject"
                    id="subject"
                    className={`shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                    Upload File
                  </label>
                  <Field
                    type="file"
                    name="file"
                    id="file"
                    className={`shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Create
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default CreateApplication;
