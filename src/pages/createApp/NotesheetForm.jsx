/* eslint-disable react/prop-types */
// NotesheetForm.js
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from "@/components/ui/button";

const NotesheetForm = ({ initialValues, onSubmit }) => {
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

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
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
    );
};

export default NotesheetForm;
