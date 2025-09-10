import React, { memo, useState } from "react";
import pluginId from "../../pluginId";
import getTrad from "../../utils/getTrad";
import {
  HeaderNav,
  PluginHeader,
  useGlobalContext  
} from "strapi-helper-plugin";
import Block from "../../components/Block";
import moment from 'moment';
import axios from 'axios';
import ExportFileForm from "../../components/ExportFileForm";
import { URL, CONTENT_TYPE } from "../../utils/constants";


const getUrl = (to) => to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

const ExportPage = () => {

  const { formatMessage } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const download = (data, fileName, type) => {
    const file = new Blob([data], {type: type});
    const href = window.URL.createObjectURL(file);
    const tempLink = document.createElement('a');
    tempLink.href = href;
    tempLink.setAttribute('download', fileName);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };
  
  const downloadCatalog  = async () => {
    setIsLoading(true);
    try {
      axios.get(
        URL.DOWNLOAD,
        {
          responseType: 'blob',
          headers: {
            'Accept':  CONTENT_TYPE.XLSX,
            'Authorization': `Bearer ${JSON.parse(window.sessionStorage.getItem('jwtToken'))}`
          }
        }
      ).then((response) => {
        download(
          response.data,
          'Catalogue_'+ moment().toISOString()+'.xlsx' ,
          CONTENT_TYPE.XLSX
        );
        setIsLoading(false);
        strapi.notification.success(formatMessage({id: getTrad("manage-catalog.export.success")}));
      });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      strapi.notification.error(formatMessage({id: getTrad("manage-catalog.export.error")}));
      strapi.notification.error(`${e}`);       
    }
  };

  return (
    <div className={"container-fluid"} style={{ padding: "18px 30px" }}>
    
    <PluginHeader
        title={formatMessage({id: getTrad("manage-catalog.admin")})}
        description={formatMessage({id: getTrad("manage-catalog.admin.descr")})}
    />
    <HeaderNav
      links={[
        {
          name: formatMessage({id: getTrad("manage-catalog.tab.import")}),
          to: getUrl("")
        },
        {
          name: formatMessage({id: getTrad("manage-catalog.tab.export")}),
          to: getUrl("export")
        }   
      ]}
      style={{ marginTop: "4.4rem" }}
    />

    <div className="row">
      <Block
        title={formatMessage({id: getTrad("admin.download")})}
        description={formatMessage({id: getTrad("admin.download.descr")})}
        style={{ marginBottom: 12 }}
      >
        <ExportFileForm 
          isLoading={isLoading} 
          downloadCatalog={downloadCatalog}
        />
       
      </Block>
    </div>
    
  </div>
  )
};

export default memo(ExportPage);