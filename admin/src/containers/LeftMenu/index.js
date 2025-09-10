import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  LeftMenuLinksSection,
  LeftMenuFooter,
  LeftMenuHeader,
  LinksContainer,
} from "../../components/LeftMenu";
import Loader from "./Loader";
import Wrapper from "./Wrapper";
import useMenuSections from "./useMenuSections";

const LeftMenu = ({ shouldUpdateStrapi, version, plugins, setUpdateMenu }) => {
  const location = useLocation();

  const {
    state: {
      isLoading,
      collectionTypesSectionLinks,
      singleTypesSectionLinks,
      generalSectionLinks,
      pluginsSectionLinks,
    },
    toggleLoading,
    generateMenu,
  } = useMenuSections(plugins, shouldUpdateStrapi);

  const filteredCollectionTypeLinks = collectionTypesSectionLinks.filter(
    ({ isDisplayed }) => isDisplayed
  );
  const filteredSingleTypeLinks = singleTypesSectionLinks.filter(
    ({ isDisplayed }) => isDisplayed
  );

  // Custom lists
  const catalogSectionResourcesArray = filteredCollectionTypeLinks
    .filter((element) => {
      console.log(element.destination);
      if (
        element.destination ===
          "/plugins/content-manager/collectionType/application::analysis.analysis" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::receptacles.receptacles" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::couleurs.couleurs" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::image.image" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::document.document"
      ) {
        return element;
      }
    })
    .map((item) => {
      let elt = {
        destination: item.destination,
        label: item.label,
        isDisplayed: item.isDisplayed,
        permissions: item.permissions,
        search: item.search,
      };
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::analysis.analysis"
      ) {
        elt.icon = "book-medical";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::receptacles.receptacles"
      ) {
        elt.icon = "vial";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::image.image"
      ) {
        elt.icon = "image";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::document.document"
      ) {
        elt.icon = "file";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::couleurs.couleurs"
      ) {
        elt.icon = "paint-brush";
        return elt;
      }
    });

  const catalogAESSectionResourcesArray = filteredCollectionTypeLinks
    .filter((element) => {
      if (
        element.destination ===
        "/plugins/content-manager/collectionType/application::analysisaes.analysisaes"
      ) {
        return element;
      }
    })
    .map((item) => {
      let elt = {
        destination: item.destination,
        label: item.label,
        isDisplayed: item.isDisplayed,
        permissions: item.permissions,
        search: item.search,
      };
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::analysisaes.analysisaes"
      ) {
        elt.icon = "book-medical";
        return elt;
      } else {
        elt.icon = "wrench";
        return elt;
      }
    });

  const actCNSSectionResourcesArray = filteredCollectionTypeLinks
    .filter((element) => {
      if (
        element.destination ===
          "/plugins/content-manager/collectionType/application::pricing.pricing" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::actes-de-prelevement.actes-de-prelevement"
      ) {
        return element;
      }
    })
    .map((item) => {
      let elt = {
        destination: item.destination,
        label: item.label,
        isDisplayed: item.isDisplayed,
        permissions: item.permissions,
        search: item.search,
      };
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::pricing.pricing"
      ) {
        elt.icon = "euro-sign";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::actes-de-prelevement.actes-de-prelevement"
      ) {
        elt.icon = "euro-sign";
        return elt;
      } else {
        elt.icon = "wrench";
        return elt;
      }
    });

  const listSectionResourcesArray = filteredCollectionTypeLinks
    .filter((element) => {
      if (
        element.destination ===
          "/plugins/content-manager/collectionType/application::day.day" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::country.country" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::codesaes.codesaes"
      ) {
        return element;
      }
    })
    .map((item) => {
      let elt = {
        destination: item.destination,
        label: item.label,
        isDisplayed: item.isDisplayed,
        permissions: item.permissions,
        search: item.search,
      };
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::day.day"
      ) {
        elt.icon = "calendar-alt";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::country.country"
      ) {
        elt.icon = "globe";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::codesaes.codesaes"
      ) {
        elt.icon = "wrench";
        return elt;
      }
    });

  const settingSectionResourcesArray = filteredCollectionTypeLinks
    .filter((element) => {
      if (
        element.destination ===
          "/plugins/content-manager/collectionType/application::analyser.analyser" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::laboratory.laboratory" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::programme.programme" ||
        element.destination ===
          "/plugins/content-manager/collectionType/application::prelevement.prelevement"
      ) {
        return element;
      }
    })
    .map((item) => {
      let elt = {
        destination: item.destination,
        label: item.label,
        isDisplayed: item.isDisplayed,
        permissions: item.permissions,
        search: item.search,
      };
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::analyser.analyser"
      ) {
        elt.icon = "chart-line";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::laboratory.laboratory"
      ) {
        elt.icon = "flask";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::prelevement.prelevement"
      ) {
        elt.icon = "flask";
        return elt;
      } else if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::programme.programme"
      ) {
        elt.icon = "microchip";
        return elt;
      }
    });

  const adminSectionResourcesArray = pluginsSectionLinks
    .filter((element) => {
      if (
        element.destination === "/plugins/manage-catalog" ||
        element.destination === "/plugins/manage-catalog-aes" ||
        element.destination === "/plugins/manage-catalog-cns"
      ) {
        return element;
      }
    })
    .concat(
      filteredCollectionTypeLinks.filter((element) => {
        if (
          element.destination ===
          "/plugins/content-manager/collectionType/application::import.import"
        ) {
          return element;
        }
      })
    )
    .map((item) => {
      if (
        item.destination ===
        "/plugins/content-manager/collectionType/application::import.import"
      ) {
        return {
          destination: item.destination,
          label: item.label,
          isDisplayed: item.isDisplayed,
          permissions: item.permissions,
          search: item.search,
          icon: "history",
        };
      } else {
        return item;
      }
    });

  const pluginSectionResourcesArray = pluginsSectionLinks.filter((element) => {
    if (
      element.destination !== "/plugins/manage-catalog" &&
      element.destination !== "/plugins/manage-catalog-aes" &&
      element.destination !== "/plugins/manage-catalog-cns"
    ) {
      return element;
    }
  });

  const generalSectionResourcesArray = generalSectionLinks.concat(
    filteredCollectionTypeLinks
      .filter((element) => {
        if (
          element.destination ===
          "/plugins/content-manager/collectionType/plugins::users-permissions.user"
        ) {
          return element;
        }
      })
      .map((item) => {
        if (
          item.destination ===
          "/plugins/content-manager/collectionType/plugins::users-permissions.user"
        ) {
          return {
            destination: item.destination,
            label: item.label,
            isDisplayed: item.isDisplayed,
            permissions: item.permissions,
            search: item.search,
            icon: "users",
          };
        } else {
          return item;
        }
      })
  );

  // This effect is really temporary until we create the menu api
  // We need this because we need to regenerate the links when the settings are being changed
  // in the content manager configurations list
  useEffect(() => {
    setUpdateMenu(() => {
      toggleLoading();
      generateMenu();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Loader show={isLoading} />
      <LeftMenuHeader />
      <LinksContainer>
        {catalogSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="catalog"
            name="catalog"
            links={catalogSectionResourcesArray}
            location={location}
            searchable
          />
        )}

        {catalogAESSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="catalogAes"
            name="catalogAes"
            links={catalogAESSectionResourcesArray}
            location={location}
            searchable
          />
        )}

        {actCNSSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="pricing"
            name="pricing"
            links={actCNSSectionResourcesArray}
            location={location}
            searchable
          />
        )}

        {adminSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="admin"
            name="admin"
            links={adminSectionResourcesArray}
            location={location}
            searchable
          />
        )}

        {(settingSectionResourcesArray.length > 0 ||
          listSectionResourcesArray.length > 0) && (
          <LeftMenuLinksSection
            section="configuration"
            name="configuration"
            links={settingSectionResourcesArray.concat(
              listSectionResourcesArray
            )}
            location={location}
            searchable
          />
        )}

        {filteredSingleTypeLinks.length > 0 && (
          <LeftMenuLinksSection
            section="singleType"
            name="singleType"
            links={filteredSingleTypeLinks}
            location={location}
            searchable
          />
        )}

        {pluginSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="plugins"
            name="plugins"
            links={pluginSectionResourcesArray}
            location={location}
            searchable={false}
            emptyLinksListMessage="app.components.LeftMenuLinkContainer.noPluginsInstalled"
          />
        )}

        {generalSectionResourcesArray.length > 0 && (
          <LeftMenuLinksSection
            section="general"
            name="general"
            links={generalSectionResourcesArray}
            location={location}
            searchable={false}
          />
        )}
      </LinksContainer>
      <LeftMenuFooter key="footer" version={version} />
    </Wrapper>
  );
};

LeftMenu.propTypes = {
  shouldUpdateStrapi: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  plugins: PropTypes.object.isRequired,
  setUpdateMenu: PropTypes.func.isRequired,
};

export default memo(LeftMenu);
