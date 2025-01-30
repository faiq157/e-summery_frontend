/* eslint-disable react/prop-types */
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

const FilterAndSearch = ({
    title,
    onDateRangeChange,
    searchQuery,
    onSearchChange,
    onCreateClick,
    dateRange,
    showbutton,
    toggleSortOrder,
    sortOrder,

}) => {
    return (
        <div className="flex justify-between w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
                {title}
            </h1>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                <Button onClick={toggleSortOrder} variant="outline" className="flex items-center space-x-2">
                    {sortOrder === 'asc' ? (
                        <>
                            <AiOutlineArrowUp size={20} />
                            <span>Sort by Date </span>
                        </>
                    ) : (
                        <>
                            <AiOutlineArrowDown size={20} />
                            <span>Sort by Date</span>
                        </>
                    )}
                </Button>
                <div className="flex gap-4">
                    {/* Shadcn Select component for date range */}
                    <Select value={dateRange} onValueChange={onDateRangeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="last_week">Last Week</SelectItem>
                                <SelectItem value="last_15_days">Last 15 Days</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search notesheets by subject..."
                    className="w-full md:w-96 p-2 border rounded-full shadow-sm focus:outline-none"
                /> {showbutton && (
                    <Button onClick={onCreateClick} className="w-full md:w-auto rounded-full">
                        Create
                    </Button>
                )}

            </div>
        </div>
    );
};

export default FilterAndSearch;
