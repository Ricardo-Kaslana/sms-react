//分页器
export const generatePagination = (currentPage: number, totalPages: number) => {
  // 如果总页数小于等于7，则显示所有页码
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 如果当前页小于等于4，则显示前5个，一个省略号和最后一个
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // 如果当前页大于总页数-4，则显示第一个，一个省略号和最后5个
  if (currentPage > totalPages - 4) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // 其他情况，显示第一个，一个省略号，当前页及其前后各一个，一个省略号，最后一个
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
