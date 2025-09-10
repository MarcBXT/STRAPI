import React from "react";
import { Table } from "@buffetjs/core";
import PropTypes from "prop-types";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import getTrad from "../../utils/getTrad";
import { useGlobalContext } from "strapi-helper-plugin";
import Row from "../../components/Row";
import P from "../../components/P";

const HistoryTable = ({items}) => {

  const history = useHistory();
  const { formatMessage } = useGlobalContext();

  const goToFile = (id) => {
    const url = `/plugins/content-manager/collectionType/application::import.import/${id}`;
    history.push(url);
  };

  const customRow = ({ row }) => {
    const { id, name_of_file, status, created_at } = row;
    const createdAt = moment(created_at);
    
    return (
      <tr style={{ paddingTop: 18 }} onClick={() => goToFile(id)}>
        <td>{name_of_file}</td> 
        <td>{status}</td>
        <td>{createdAt.format("DD/MM/YYYY HH:mm")}</td>
      </tr>
    );
  };

  const headers = [
    { name: formatMessage({id: getTrad("manage-catalog-aes.import.header.name")}), value: "name_of_file" },
    { name: formatMessage({id: getTrad("manage-catalog-aes.import.header.status")}), value: "status" },
    { name: formatMessage({id: getTrad("manage-catalog-aes.import.header.date")}), value: "created_at" }
  ];

  return (
    <div className={"col-12"}>
      <Row className={"row"}>        
        <Table
          headers={headers}
          rows={items}
          customRow={customRow}
        />
     </Row>
    </div>
  )
};

HistoryTable.propTypes = {
  items: PropTypes.array.isRequired
};

export default HistoryTable;