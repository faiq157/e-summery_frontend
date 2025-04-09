import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const NotesheetForm = ({ initialValues, onSubmit }) => {
    const [selectedOption, setSelectedOption] = useState("file");  // Only one option can be selected
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOptionChange = (option) => {
        setSelectedOption(option);  // Set the selected option
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

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

    const validationSchema = Yup.object({
        userName: Yup.string().required("Name is required"),
        subject: Yup.string().required("Subject is required"),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <TextInput label="Name" name="userName" />
                    <TextInput label="Contact Number" name="contact_number" />
                    <TextInput label="User Email" name="userEmail" />
                    <TextInput label="Subject" name="subject" />

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Select an option:
                        </label>
                        <RadioGroup
                            value={selectedOption}
                            onValueChange={handleOptionChange}
                            className="flex items-center space-x-4"
                        >
                            <label className="flex items-center space-x-2">
                                <RadioGroupItem value="file" />
                                <span>Upload File</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <RadioGroupItem value="text" />
                                <span>Add Text</span>
                            </label>
                        </RadioGroup>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedOption === "file" && (
                            <motion.div
                                key="fileInput"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                                    <FaCloudUploadAlt className="h-12 w-12 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Drag & drop or click below to upload
                                    </p>

                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer inline-block bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-900 transition"
                                    >
                                        Choose File
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            handleFileChange(event);
                                            setFieldValue("file", event.currentTarget.files[0]);
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                {selectedFile && (
                                    <div className="mt-4 p-2 border rounded bg-gray-50">
                                        <p className="text-sm text-gray-700 font-medium">
                                            {selectedFile.name} (
                                            {(selectedFile.size / 1024).toFixed(2)} KB)
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="text-red-500 text-xs underline mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {selectedOption === "text" && (
                            <motion.div
                                key="textInput"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <TextInput
                                    label="Description"
                                    name="description"
                                    as="textarea"
                                    placeholder="Enter description here..."
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-6 flex justify-end">
                        <Button className="rounded-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <FaSpinner className="animate-spin text-black" size={24} />  : "Create"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NotesheetForm;
