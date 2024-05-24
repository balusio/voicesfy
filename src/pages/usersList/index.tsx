import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Button, Input, Space, Table, Layout } from "antd";
import type { TableProps } from "antd";
import { current } from "@reduxjs/toolkit";
import { SearchOutlined } from "@ant-design/icons";
import { DATA_TYPES, PAGINATION_RANGE, TableData, formatData } from "./utils";

const layoutStyles = {
  width: "100%",
  display: "flex",
  "flex-direction": "column",
};

function UsersList() {
  const [data, setData] = useState<TableData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<TableData[]>(data);

  const handleSearch = (value: string, prop: keyof TableData) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      item[prop].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns: TableProps<TableData>["columns"] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={searchText}
            onChange={(e) => {
              handleSearch(e.target.value, DATA_TYPES.firstName);
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      filterSearch: true,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={searchText}
            onChange={(e) => {
              handleSearch(e.target.value, DATA_TYPES.lastName);
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (data) => (
        <img src={data} width="100px" height="100px" alt={data} />
      ),
    },
  ];

  const resetFilters = () => {
    setFilteredData(data);
    setSearchText("");
  };

  const [pagination, setPagination] = useState({
    total: 1,
    current: 1,
    skip: 0,
  });

  const onPaginationChange = (pageNumber: number) => {
    getData(PAGINATION_RANGE, PAGINATION_RANGE * (pageNumber - 1));

    setPagination((prevValue) => ({
      ...prevValue,
      current: pageNumber,
      skip: PAGINATION_RANGE * pageNumber,
    }));
  };

  const getData = useCallback(async (range: number, skip: number) => {
    const response = await fetch(
      `http://dummyjson.com/users?limit=${range}&skip=${skip}&select=id,image,firstName,lastName,email`
    );
    const data = await response.json();
    const formattedData = formatData(data.users);

    setData(formattedData);

    // on change pagination you must check data formatted
    setFilteredData(formattedData);
    setPagination((prevValue) => ({
      ...prevValue,
      total: data.total,
    }));
  }, []);

  useEffect(() => {
    getData(PAGINATION_RANGE, pagination.skip);
  }, []);

  return (
    <div style={layoutStyles}>
      <Button
        onClick={resetFilters}
        style={{
          margin: "10px 0 10px 0",
          maxWidth: "30%",
          alignSelf: "flex-end",
        }}
      >
        Reset Filters
      </Button>
      <Table
        size="large"
        pagination={{
          defaultPageSize: 13,
          current: pagination.current,
          total: pagination.total,
          onChange: onPaginationChange,
        }}
        columns={columns}
        dataSource={filteredData}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export { UsersList };
