import React from "react";
import Row from "../Row";
import getTrad from "../../utils/getTrad";
import { useGlobalContext } from "strapi-helper-plugin";
import { Button } from "@buffetjs/core";
import PropTypes from "prop-types";

const ExportFileForm = ({downloadCatalog, isLoading}) => {

  const { formatMessage } = useGlobalContext();

  return (
    <div className={"col-12"}>
      <Row className={"row"}>
          <Button
            label={formatMessage({id: getTrad("manage-catalog.button.export")})}
            color={isLoading ? "secondary" : "cancel"}
            disabled={isLoading}
            onClick={() => downloadCatalog()}
            isLoading={isLoading}
          />
        </Row>
    </div>
  )
};

ExportFileForm.propTypes = {
  downloadCatalog: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ExportFileForm;