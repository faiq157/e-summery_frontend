/* eslint-disable react/prop-types */
import { AiOutlineClose } from "react-icons/ai";
import NotesheetForm from './NotesheetForm';

const EditApplication = ({ isOpen, onClose, notesheet, onEditSave }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[60vw] h-[90vh] overflow-auto">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold mb-4">Edit Notesheet</h2>
                        <AiOutlineClose onClick={onClose} className="cursor-pointer text-2xl" />
                    </div>
                    <NotesheetForm
                        initialValues={{
                            description: notesheet?.description || '',
                            subject: notesheet?.subject || '',
                            userName: notesheet?.userName || '',
                            contact_number: notesheet?.contact_number || '',
                            userEmail: notesheet?.userEmail || '',
                            status: notesheet?.status || '',
                            file: null,
                        }}
                        onSubmit={onEditSave}
                        onClose={onClose}
                    />
                </div>
            </div>
        )
    );
};

export default EditApplication;
