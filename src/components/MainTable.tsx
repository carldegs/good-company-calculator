import React, { useState, HTMLAttributes, useEffect } from "react";
import { Table, TableProps } from "semantic-ui-react";

import orderBy from "lodash/fp/orderBy";

export interface Column {
  name: string;
  value: string;
  sortable?: boolean;
  render?: Function;
}

interface IProps extends TableProps {
  columnList: Column[];
  data: any;
}

const getLodashOrder = (order: string) => {
  switch(order) {
    case "ascending":
      return "asc";
    case "descending":
    default:
      return "desc";
  }
}

const MainTable = ({
  columnList,
  data,
  sortable,
  ...props
}: IProps) => {
  const [sort, setSort] = useState({
    column: columnList[0].value,
    direction: "ascending",
  } as {
    column: string;
    direction: "ascending" | "descending";
  });
  const [modifiedData, modifyData] = useState(data);

  const handleSort = (colVal: string) => {
    if (colVal === sort.column) {
      setSort({
        ...sort,
        direction: sort.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSort({
        column: colVal,
        direction: "ascending",
      });
    }

    modifyData(orderBy([colVal], [getLodashOrder(sort.direction)], data));
  };

  useEffect(() => {
    modifyData(data);
  }, [data]);

  return (
    <Table {...props}>
      <Table.Header>
        <Table.Row>
          {columnList.map((col) => (
            <Table.HeaderCell
              sorted={
                col.sortable && sort.column === col.value
                  ? sort.direction
                  : undefined
              }
              key={col.value}
              onClick={col.sortable && (() => handleSort(col.value))}
            >{col.name}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {modifiedData.map((row: any, i: number) => (
          <Table.Row key={`${row[columnList[0].value]}-${i}`}>
            {columnList.map((col: Column) => (
              <Table.Cell key={`${i}-${col.value}`}>{col.render ? col.render(row, i) : row[col.value]}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default MainTable;
