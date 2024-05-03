import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { DefaultColumnFilter } from "./filters";

import {
  ProductsGlobalFilter,
  CustomersGlobalFilter,
  OrderGlobalFilter,
  ContactsGlobalFilter,
  CompaniesGlobalFilter,
  LeadsGlobalFilter,
  CryptoOrdersGlobalFilter,
  InvoiceListGlobalSearch,
  TicketsListGlobalFilter,
  NFTRankingGlobalFilter,
  TaskListGlobalFilter
} from "../../Components/Common/GlobalSearchFilter";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isProductsFilter,
  isLeadsFilter,
  SearchPlaceholder,
  setSearchVal
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
    setSearchVal(value)
  }, 200);
  return (
    <React.Fragment>
      <CardBody className="border border-dashed border-end-0 border-start-0">
        <form>
          <Row className="g-3">
            <Col>
              <div className={(isProductsFilter || isContactsFilter || isCompaniesFilter || isNFTRankingFilter) ? "search-box me-2 mb-2 d-inline-block" : "search-box me-2 mb-2 d-inline-block col-12"}>
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search /"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </Col>
            {isProductsFilter && (
              <ProductsGlobalFilter />
            )}
            {isCustomerFilter && (
              <CustomersGlobalFilter />
            )}
            {isOrderFilter && (
              <OrderGlobalFilter />
            )}
            {isContactsFilter && (
              <ContactsGlobalFilter />
            )}
            {isCompaniesFilter && (
              <CompaniesGlobalFilter />
            )}
            {isLeadsFilter && (
              <LeadsGlobalFilter />
            )}
            {isCryptoOrdersFilter && (
              <CryptoOrdersGlobalFilter />
            )}
            {isInvoiceListFilter && (
              <InvoiceListGlobalSearch />
            )}
            {isTicketsListFilter && (
              <TicketsListGlobalFilter />
            )}
            {isNFTRankingFilter && (
              <NFTRankingGlobalFilter />
            )}
            {isTaskListFilter && (
              <TaskListGlobalFilter />
            )}
          </Row>
        </form>
      </CardBody>

    </React.Fragment>
  );
}

const CustomTableContainer = ({
  columns,
  data,
  totalRecords,
  isGlobalSearch,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  pageIndex,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  setPageIndex,
  searchVal,
  setSearchVal,
  SearchPlaceholder,
  customPageOptions,
  totalLength,
  toNextPage,
  toPreviousPage,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    //canPreviousPage,
    //canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: pageIndex,   // Set the initial page index from prop
        pageSize: customPageSize, // Calculate page size from prop
        selectedRowIds: 0,
        sortBy: [
          {
            id:"job_number",
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  // Calculate the start and end ranges for displaying records
  const startRange = (pageIndex) * customPageSize + 1;
  const endRange = Math.min((pageIndex + 1) * customPageSize, totalRecords ? totalRecords : data.length);
  const filterEndRange = Math.min((pageIndex + 1) * customPageSize, data.length);
  const pageCount = Math.ceil(totalRecords / customPageSize);
  const Totalpages = [...Array(pageCount).keys()];
  // console.log(totalLength-((pageIndex+1)*customPageSize),'total')
  // let endRange = pageIndex + 1 * customPageSize   
  // if (totalLength-((pageIndex+1)*customPageSize)<0){
  //   endRange = totalLength
  // }
  // console.log(endRange)
  const pageOptions = customPageOptions || [...Array(pageCount).keys()];
  //var canNextPage = false;
  //var canPreviousPage = false;

  // const startRange = pageIndex * customPageSize + 1;
  // const endRange = Math.min((pageIndex + 1) * customPageSize, totalRecords);

  // Calculate the `canNextPage` and `canPreviousPage` variables
  const canNextPage = pageIndex + 1 < Totalpages.length;
  const canPreviousPage = pageIndex > 0;

  // Generate the sorting indicator
  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    setPageIndex(page);
    gotoPage(page);
  };

  const onNextBtn = (event) => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1)
      console.log("next");
      gotoPage(pageIndex + 1);
    }
  }

  const onPrevBtn = (event) => {
    if (canPreviousPage) {
      setPageIndex(pageIndex - 1)
      console.log("prev");
      gotoPage(pageIndex - 1);
    }
  }

  const OnChangeSearch = (val) => {
    setSearchVal(val)
  }

  return (
    <Fragment>
      <Row className="mb-3">
        {isGlobalSearch && (
          <Col md={1}>
            <select
              className="form-select"
              value={customPageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            setSearchVal={OnChangeSearch}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isProductsFilter={isProductsFilter}
            isCustomerFilter={isCustomerFilter}
            isOrderFilter={isOrderFilter}
            isContactsFilter={isContactsFilter}
            isCompaniesFilter={isCompaniesFilter}
            isLeadsFilter={isLeadsFilter}
            isCryptoOrdersFilter={isCryptoOrdersFilter}
            isInvoiceListFilter={isInvoiceListFilter}
            isTicketsListFilter={isTicketsListFilter}
            isNFTRankingFilter={isNFTRankingFilter}
            isTaskListFilter={isTaskListFilter}
            SearchPlaceholder={SearchPlaceholder}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className={divClass}>
        <Table hover {...getTableProps()} className={tableClass}>
          <thead className={theadClass}>
            {headerGroups.map((headerGroup) => (
              <tr className={trClass} key={headerGroup.id}  {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
      <Row>

        {searchVal ? (
          <Col className="col-7 pt-3">
            <p> Showing{" "}
              {startRange} to{" "} {filterEndRange} of {data.length} {"entries"} {"(filtered from"} {totalRecords} {"total entries)"}
            </p>
          </Col>
        ) : (
          <Col className="col-7 pt-3">
            <p> Showing{" "}
              {startRange} to{" "} {endRange} of {totalRecords} entries
            </p>
          </Col>
        )}

        <Col className="col-5">
          <Row className="justify-content-md-end justify-content-center align-items-center p-2">
            <Col className="col-md-auto">
              <div className="d-flex gap-1">
                <Button
                  color="primary"
                  onClick={onPrevBtn}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </Button>
              </div>
            </Col>
            <Col className="col-md-auto d-none d-md-block">
              Page{" "}
              <strong>
                {pageIndex + 1} of {Totalpages.length}
              </strong>
            </Col>
            <Col className="col-md-auto">
              <Input
                type="number"
                min={1}
                value={pageIndex + 1}
                style={{ width: 70 }}
                max={Totalpages.length}
                defaultValue={pageIndex + 1}
                onChange={onChangeInInput}
              />
            </Col>
            <Col className="col-md-auto">
              <div className="d-flex gap-1">
                <Button
                  color="primary"
                  onClick={onNextBtn}
                  disabled={!canNextPage}
                >
                  {">"}
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

CustomTableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
  value: PropTypes.string,
};

export default CustomTableContainer;
