import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const PaginationUI = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    />
                </PaginationItem>

                {/* Page Number Links */}
                {[...Array(totalPages).keys()].map((pageNum) => (
                    <PaginationItem key={pageNum + 1}>
                        <PaginationLink
                            href="#"
                            isActive={pageNum + 1 === currentPage}
                            onClick={() => setCurrentPage(pageNum + 1)}
                        >
                            {pageNum + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Ellipsis if necessary */}
                {totalPages > 10 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next Page Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationUI;
