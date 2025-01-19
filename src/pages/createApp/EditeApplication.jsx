/* eslint-disable react/prop-types */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from 'react';

const EditApplication = ({ isOpen, onClose, notesheet, onEditSave }) => {
    const [initialValues, setInitialValues] = useState({
        description: '',
        subject: '',
        userName: '',
        email: '',
        contact_number: '',
        userEmail: '',
        status: '',
        file: null,
    });
    useEffect(() => {
        if (notesheet) {
            setInitialValues({
                description: notesheet?.description,
                subject: notesheet?.subject,
                userName: notesheet?.userName,
                contact_number: notesheet?.contact_number,
                userEmail: notesheet?.userEmail,
                status: notesheet?.status,
                file: null,
            });
        }
    }, [notesheet]);



    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[60vw] h-[90vh] overflow-auto">
                    <div className='flex justify-between'>
                        <h2 className="text-2xl font-bold mb-4">Edit Notesheet</h2>
                        <AiOutlineClose onClick={onClose} />
                    </div>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={onEditSave}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                {/* Subject Field */}
                                <div className="mb-4">
                                    <label htmlFor="subject" className="block text-gray-700">Subject</label>
                                    <Field
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="subject" component="div" className="text-red-500" />
                                </div>

                                {/* Description Field */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700">Description</label>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        id="description"
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="description" component="div" className="text-red-500" />
                                </div>

                                {/* UserName Field */}
                                <div className="mb-4">
                                    <label htmlFor="userName" className="block text-gray-700">User Name</label>
                                    <Field
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="userName" component="div" className="text-red-500" />
                                </div>


                                {/* Contact Number Field */}
                                <div className="mb-4">
                                    <label htmlFor="contact_number" className="block text-gray-700">Contact Number</label>
                                    <Field
                                        type="text"
                                        name="contact_number"
                                        id="contact_number"
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="contact_number" component="div" className="text-red-500" />
                                </div>

                                {/* User Email Field */}
                                <div className="mb-4">
                                    <label htmlFor="userEmail" className="block text-gray-700">User Email</label>
                                    <Field
                                        type="email"
                                        name="userEmail"
                                        id="userEmail"
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="userEmail" component="div" className="text-red-500" />
                                </div>

                                {/* Status Field */}


                                {/* File Upload Field */}
                                <div className="mb-4">
                                    <label htmlFor="file" className="block text-gray-700">Upload File</label>
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        onChange={(e) => setFieldValue("file", e.currentTarget.files[0])}
                                        className="block w-full p-2 border rounded"
                                    />
                                    <ErrorMessage name="file" component="div" className="text-red-500" />
                                </div>

                                {/* Submit Button */}
                                <div className="mb-4">
                                    <Button type="submit" disabled={isSubmitting}>Submit</Button>
                                </div>
                            </Form>

                        )}
                    </Formik>
                </div>
            </div>
        )
    );
};

export default EditApplication;
