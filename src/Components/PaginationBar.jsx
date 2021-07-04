import React, { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

const fetchPageNumbers = (
  currentPage,
  totalRecords,
  pageLimit,
  pageNeighbours
) => {
  const totalPages = Math.ceil(totalRecords / pageLimit);
  const totalNumbers = (pageNeighbours * 2) + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    let pages = range(startPage, endPage);

    const hasLeftSpill = startPage > 2;
    const hasRightSpill = (totalPages - endPage) > 1;
    const spillOffset = totalNumbers - (pages.length + 1);

    switch (true) {
      case (hasLeftSpill && !hasRightSpill): {
        const extraPages = range(startPage - spillOffset, startPage - 1);
        pages = [LEFT_PAGE, ...extraPages, ...pages];
        break;
      }

      case (!hasLeftSpill && hasRightSpill): {
        const extraPages = range(endPage + 1, endPage + spillOffset);
        pages = [...pages, ...extraPages, RIGHT_PAGE];
        break;
      }

      case (hasLeftSpill && hasRightSpill):
      default: {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
        break;
      }
    }

    return [1, ...pages, totalPages];
  }

  return range(1, totalPages);
}

const PaginationBar = ({
  totalRecords = 0,
  pageLimit = 25,
  pageNeighbours = 0,
  onPageChanged = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);

  const gotoPage = (page) => {
    const totalPages = Math.ceil(totalRecords / pageLimit);
    const newCurrentPage = Math.max(0, Math.min(page, totalPages));
    setCurrentPage(newCurrentPage);
    onPageChanged(newCurrentPage)
  }

  const handleClick = page => event => {
    event.preventDefault();
    gotoPage(page);
  }

  const handleMoveLeft = event => {
    event.preventDefault();
    gotoPage(currentPage - (pageNeighbours * 2) - 1);
  }

  const handleMoveRight = event => {
    event.preventDefault();
    gotoPage(currentPage + (pageNeighbours * 2) + 1);
  }

  useEffect(() => {
    const pageNumbers = fetchPageNumbers(
      currentPage,
      totalRecords,
      pageLimit,
      pageNeighbours
    );

    setPages(pageNumbers);
  }, [
    currentPage,
    totalRecords,
    pageLimit,
    pageNeighbours
  ]);


  return (
    <Pagination>
      {pages.map((page, index) => {

        if (page === LEFT_PAGE) return (
          <Pagination.Prev key={index} onClick={handleMoveLeft} />
        );

        if (page === RIGHT_PAGE) return (
          <Pagination.Next key={index} onClick={handleMoveRight} />
        );

        return (
          <Pagination.Item
            key={index}
            active={currentPage === page}
            onClick={handleClick(page)}
          >
            {page}
          </Pagination.Item>
        );
      })}
    </Pagination>
  );
}

export default PaginationBar;