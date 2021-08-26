import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationBar = ({ postsPerPage, totalPosts, paginate, ActivePage }) => {

  var active = ActivePage;
  let items = [];
  for (let number = 1; number <= Math.ceil(totalPosts / postsPerPage); number++) {
    items.push(
      <Pagination.Item onClick={() => { paginate(number) }} key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <Pagination >{items}</Pagination>
  )
}


export default PaginationBar;

