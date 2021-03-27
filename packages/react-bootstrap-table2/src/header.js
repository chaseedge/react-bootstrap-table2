/* eslint react/require-default-props: 0 */
import React, { useState } from "react";
import PropTypes from "prop-types";

import HeaderCell from "./header-cell";
import SelectionHeaderCell from "./row-selection/selection-header-cell";
import ExpandHeaderCell from "./row-expand/expand-header-cell";
import withHeaderSelection from "./row-selection/selection-header-cell-consumer";
import withHeaderExpansion from "./row-expand/expand-header-cell-consumer";
import Const from "./const";

const Header = (props) => {
  const {
    className,
    columns,
    onSort,
    onFilter,
    sortField,
    sortOrder,
    selectRow,
    expandRow,
    currFilters,
    onExternalFilter,
    filterPosition,
    globalSortCaret,
    wrapperClasses,
  } = props;

  let SelectionHeaderCellComp = () => null;
  let ExpansionHeaderCellComp = () => null;

  if (expandRow.showExpandColumn) {
    ExpansionHeaderCellComp = withHeaderExpansion(ExpandHeaderCell);
  }

  if (selectRow) {
    SelectionHeaderCellComp = withHeaderSelection(SelectionHeaderCell);
  }

  const isRenderFunctionColumnInLeft = (position = Const.INDICATOR_POSITION_LEFT) =>
    position === Const.INDICATOR_POSITION_LEFT;

  var hasParent = false;
  var colSpanned = 0;
  const parentRow = [];

  const childrens = [];

  columns.forEach((column, i) => {
    const currSort = column.dataField === sortField;
    const isLastSorting = column.dataField === sortField;
    const parentHeader = column.parentHeader;

    if (parentHeader !== undefined) {
      (hasParent = true), (colSpanned = parentHeader.colSpan ? parentHeader.colSpan : 1);
      parentHeader.push(
        <th index={i} key={column.dataField} colSpan={parentHeader.colSpan} className={parentHeader.headerClasses}>
          {parentHeader.text}
        </th>
      );
    } else if (colSpanned <= 1) {
      parentHeader.push(<th />);
    } else {
      colSpanned -= 1;
    }

    childrens.push(
      <HeaderCell
        index={i}
        key={column.dataField}
        column={column}
        onSort={onSort}
        sorting={currSort}
        sortOrder={sortOrder}
        globalSortCaret={globalSortCaret}
        isLastSorting={isLastSorting}
        onFilter={onFilter}
        currFilters={currFilters}
        onExternalFilter={onExternalFilter}
        filterPosition={filterPosition}
      />
    );
  });

  if (!selectRow.hideSelectColumn) {
    if (isRenderFunctionColumnInLeft(selectRow.selectColumnPosition)) {
      childrens.unshift(<SelectionHeaderCellComp key="selection" />);
      parentRow.unshift(<SelectionHeaderCellComp key="selection" />);
    } else {
      childrens.push(<SelectionHeaderCellComp key="selection" />);
      parentRow.push(<SelectionHeaderCellComp key="selection" />);
    }
  }

  if (expandRow.showExpandColumn) {
    if (isRenderFunctionColumnInLeft(expandRow.expandColumnPosition)) {
      childrens.unshift(<ExpansionHeaderCellComp key="expansion" />);
      parentRow.unshift(<ExpansionHeaderCellComp key="expansion" />);
    } else {
      childrens.push(<ExpansionHeaderCellComp key="expansion" />);
      parentRow.push(<ExpansionHeaderCellComp key="expansion" />);
    }
  }

  return (
    <thead className={wrapperClasses}>
      {hasParent ? <tr className={className}>{parentRow}</tr> : null}
      <tr className={className}>{childrens}</tr>
    </thead>
  );
};

Header.propTypes = {
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  selectRow: PropTypes.object,
  currFilters: PropTypes.object,
  onExternalFilter: PropTypes.func,
  globalSortCaret: PropTypes.func,
  className: PropTypes.string,
  wrapperClasses: PropTypes.string,
  expandRow: PropTypes.object,
  filterPosition: PropTypes.oneOf([
    Const.FILTERS_POSITION_TOP,
    Const.FILTERS_POSITION_INLINE,
    Const.FILTERS_POSITION_BOTTOM,
  ]),
};

export default Header;
