import React, { useState } from "react";
import P from "../P";
import Row from "../Row";
import Label from "../Label";
import PropTypes from "prop-types";
import { Button } from "@buffetjs/core";
import getTrad from "../../utils/getTrad";
import { useGlobalContext } from "strapi-helper-plugin";
import src from "../../assets/images/logo-excel.png";

const ImportFileForm = ({onUploadFile, isLoading}) => {
  
  const [file, setFile] = useState(null);
  const [type, setType] = useState(null);  
  const [name, setName] = useState(null);
  const [data, setData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { formatMessage } = useGlobalContext();

  const onChangeImportFile = (file) => {
    if (file !== null) {
      setFile(file);
      setName(file.name);
      setType(file.type);
      setIsDragging(true);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        setData(e.target.result);
      };
    }
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const filetmp = e.dataTransfer.files[0];
    onChangeImportFile(filetmp);
  };

  const clickUploadFile = async () => {
   if (file !== null) {   
      onUploadFile({
        type,
        name,
        data
      }).then(() => {
        setFile(null);
        setData(null);
        setName(null);
        setType(null);
      });
   }    
  };

  return (
    <div className={"col-12"}>
     
      <Row className={"row"}>
        <Label
          showLoader={isLoading}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <img src={src} style={{ maxHeight: '40px' }}/>
          <span style={{color: '#9ea7b8'}}>&nbsp;{name}</span>
          <P>
            <span>{formatMessage({id: getTrad("manage-catalog.drag.drop")})}</span>
          </P>

          <div onDragLeave={handleDragLeave} className="isDragging" />

          <input
            name="file_input"
            accept=".xlsx"
            onChange={(event) => onChangeImportFile(event.target.files[0])}
            type="file"
          />

        </Label>
      </Row>
      
      <Row className={"row"}>
        <Button
          label={formatMessage({id: getTrad("manage-catalog.button.import")})}
          color={file && isLoading ? "secondary" : "cancel"}
          disabled={!file || isLoading}
          onClick={clickUploadFile}
          isLoading={isLoading}
        />
      </Row>
      
    </div>
  );  
};

ImportFileForm.propTypes = {
  onUploadFile: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ImportFileForm;