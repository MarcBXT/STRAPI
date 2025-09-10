
import React, { memo, useState, useEffect } from "react";
import {request} from "strapi-helper-plugin";
import pluginId from "../../pluginId";
import getTrad from "../../utils/getTrad";
import {
  HeaderNav,
  PluginHeader,
  useGlobalContext
} from "strapi-helper-plugin";
import Block from "../../components/Block";
import ImportFileForm from "../../components/ImportFileForm";
import HistoryTable from "../../components/HistoryTable";
import { URL } from "../../utils/constants";

const getUrl = to => to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

const HomePage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const { formatMessage } = useGlobalContext();

  const onUploadFile = async (analysisConfig) => {
    setIsLoading(true);
    try {
      const response = await request(URL.UPLOAD, {
        method: "POST",
        body: {
          data: analysisConfig.data, 
          name: analysisConfig.name, 
          type: analysisConfig.type
        }
      });

      setIsLoading(false);
      await loadHistory();
      strapi.notification.success(formatMessage({id: getTrad("manage-catalog-cns.import.success")}));
    } catch (e) {
      setIsLoading(false);
      await loadHistory();
      strapi.notification.error(formatMessage({id: getTrad("manage-catalog-cns.import.error")}));
      strapi.notification.error(`${e}`);       
    }   
  };

  const loadHistory = async () => {
    const resp = await request(URL.GET_HISTORIES, { method: "GET"});
    setItems(resp);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (

    <div className={"container-fluid"} style={{ padding: "18px 30px" }}>
      <PluginHeader
          title={formatMessage({id: getTrad("manage-catalog-cns.admin")})}
          description={formatMessage({id: getTrad("manage-catalog-cns.admin.descr")})}
      />
      <HeaderNav
        links={[
          {
            name: formatMessage({id: getTrad("manage-catalog-cns.tab.import")}),
            to: getUrl("")
          },
          {
            name: formatMessage({id: getTrad("manage-catalog-cns.tab.export")}),
            to: getUrl("export")
          }   
        ]}
        style={{ marginTop: "4.4rem" }}
      />

      <div className="row">
        <Block
          title={formatMessage({id: getTrad("admin.update")})}
          description={formatMessage({id: getTrad("admin.update.descr")})}
          style={{ marginBottom: 12 }}
        > 
          <ImportFileForm
            onUploadFile={onUploadFile}
            isLoading={isLoading}
          />
        </Block>

        <Block
          title={formatMessage({id: getTrad("admin.histo")})}
          style={{ marginBottom: 12 }}
        > 
          <HistoryTable
            items={items}
          />
        
        </Block>
      </div>
    </div>
  )  
};

export default memo(HomePage);
