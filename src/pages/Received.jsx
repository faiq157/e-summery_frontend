import { useState, useEffect } from 'react';
import Dashboardlayout from '@/layout/Dashboardlayout';
import NotesheetCardList from '@/components/NotesheetCardList';
import { useNotesheetContext } from '@/context/NotesheetContext';
import PaginationUI from '@/components/PaginationUI';
import FilterAndSearch from '@/components/FilterAndSearch';

const Received = () => {
    const [storedEmail, setStoredEmail] = useState('');
    const storedUser = localStorage.getItem('user');
    const [userRole, setUserRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { fetchNotesheets } = useNotesheetContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const storedToken = localStorage.getItem('token');
    const [dateRange, setDateRange] = useState("all");
    const [sortOrder, setSortOrder] = useState('dec');
    useEffect(() => {
        // Fetch the email from the stored user object
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setStoredEmail(userObject.email || ''); // Set the email if it exists
            setUserRole(userObject.role || ''); // Set the user role if it exists
        }
    }, [storedUser]);  // Run this effect only when `storedUser` changes
    useEffect(() => {
        if (userRole && limit && currentPage) {
            fetchNotesheets(userRole, "Received", storedToken, currentPage, limit, setTotalPages);
        }
    }, [userRole, storedToken, currentPage, limit]);


    useEffect(() => {
        const fetchData = setTimeout(() => {
            if (userRole && limit && currentPage) {
                fetchNotesheets(
                    userRole,
                    "Received",
                    storedToken,
                    currentPage,
                    limit,
                    setTotalPages,
                    searchQuery,
                    dateRange || "" // Include dateRange in the API request
                );
            }
        }, 1000);

        return () => clearTimeout(fetchData);
    }, [searchQuery, dateRange]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
    };
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };



    return (
        <Dashboardlayout>
            <div className="p-8">
                {/* Create Button */}

                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <FilterAndSearch
                        title="Recived Application"
                        onDateRangeChange={handleDateRangeChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        dateRange={dateRange}
                        showbutton={false}
                        toggleSortOrder={toggleSortOrder}
                        sortOrder={sortOrder}
                    />
                </div>

                {/* Show the list of created notesheets (could be fetched from an API or static data) */}
                <div className="mt-8">
                    <NotesheetCardList
                        status={"Received"}
                        searchQuery={searchQuery}
                        userRole={userRole}
                        sortOrder={sortOrder}
                    />
                    {totalPages > 1 && (
                        <div className='mt-5'>
                            <PaginationUI
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>

        </Dashboardlayout>
    );
};

export default Received;
