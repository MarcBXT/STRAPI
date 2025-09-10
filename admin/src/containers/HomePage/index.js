/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';

import { Block, Container, LinkWrapper, P } from './components';

const CATALOG_LINKS = [
  {
    id: 'analysis',
    contentId: 'homepage.links.catalog.analysis.descr',
    titleId: 'homepage.links.catalog.analysis',
    type: 'analyses',
    link: '/plugins/content-manager/collectionType/application::analysis.analysis?page=1&pageSize=20&_sort=code:ASC'
  },
  {
    id: 'tubes',
    contentId: 'homepage.links.catalog.tubes.descr',
    titleId: 'homepage.links.catalog.tubes',
    type: 'tubes',
    link: '/plugins/content-manager/collectionType/application::receptacles.receptacles?page=1&pageSize=10&_sort=code:ASC'
  },
  {
    id: 'couleurs',
    contentId: 'homepage.links.catalog.couleurs.descr',
    titleId: 'homepage.links.catalog.couleurs',
    type: 'couleurs',
    link: '/plugins/content-manager/collectionType/application::couleurs.couleurs?page=1&pageSize=10&_sort=code:ASC'
  },
];

const SETTING_LINKS_1 = [
  {
    id: 'analyser',
    contentId: 'homepage.links.settings.analyser.descr',
    titleId: 'homepage.links.settings.analyser',
    type: 'analyser',
    link: '/plugins/content-manager/collectionType/application::analyser.analyser?page=1&pageSize=10&_sort=code:ASC'
  },
  {
    id: 'laboratory',
    contentId: 'homepage.links.settings.centrifugation.descr',
    titleId: 'homepage.links.settings.centrifugation',
    type: 'laboratory',
    link: '/plugins/content-manager/collectionType/application::programme.programme?page=1&pageSize=10&_sort=code:ASC'
  },
];

const SETTING_LINKS_2 = [
  {
    id: 'centrifugation',
    contentId: 'homepage.links.settings.laboratory.descr',
    titleId: 'homepage.links.settings.laboratory',
    type: 'centrifugation',
    link: '/plugins/content-manager/collectionType/application::laboratory.laboratory?page=1&pageSize=10&_sort=code:ASC'
  }
];

const ADMIN_LINKS = [
  {
    id: 'import',
    contentId: 'homepage.links.admin.import.descr',
    titleId: 'homepage.links.admin.import',
    type: 'upload',
    link: '/plugins/manage-catalog'
  },
  {
    id: 'export',
    contentId: 'homepage.links.admin.export.descr',
    titleId: 'homepage.links.admin.export',
    type: 'download',
    link: '/plugins/manage-catalog/export'
  }
];

const HomePage = ({ history: { push } }) => {

  const handleClick = (link) => {
    push(link);
  };

  const headerId = 'HomePage.greetings';
  const username = get(auth.getUserInfo(), 'firstname', '');

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>

      <Container className="container-fluid">
        <div className="row">
          <div className="col-12">

            <Block>
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>

              <FormattedMessage id="homepage.welcome">
                  {msg => <P>{msg}</P>}
              </FormattedMessage>
            </Block>

            <Block>
              <FormattedMessage id="homepage.links.catalog">
                {msg => <h4>{msg}</h4>}
              </FormattedMessage>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {CATALOG_LINKS.map((data) => {
                  return (
                    <LinkWrapper
                        href=""
                        key={data.id}
                        type={data.type}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(data.link)}
                        }>
                      <FormattedMessage id={data.titleId}>
                        {title => <p className="bold">{title}</p>}
                      </FormattedMessage>
                      <FormattedMessage id={data.contentId}>
                        {content => <p>{content}</p>}
                      </FormattedMessage>

                    </LinkWrapper>
                  );
                })}
              </div>
            </Block>

            <Block>
              <FormattedMessage id="homepage.links.admin">
              {msg => <h4>{msg}</h4>}
              </FormattedMessage>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                {ADMIN_LINKS.map((data) => {
                  return (
                    <LinkWrapper
                        href=""
                        key={data.id}
                        type={data.type}
                        rel="noopener noreferrer"
                        onClick={(e) => {e.preventDefault(); handleClick(data.link)}}>
                      <FormattedMessage id={data.titleId}>
                        {title => <p className="bold">{title}</p>}
                      </FormattedMessage>
                      <FormattedMessage id={data.contentId}>
                        {content => <p>{content}</p>}
                      </FormattedMessage>

                    </LinkWrapper>
                  );
                })}
              </div>
            </Block>

            <Block>
              <FormattedMessage id="homepage.links.settings">
              {msg => <h4>{msg}</h4>}
              </FormattedMessage>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                {SETTING_LINKS_1.map((data) => {
                  return (
                    <LinkWrapper
                        href=""
                        key={data.id}
                        type={data.type}
                        rel="noopener noreferrer"
                        onClick={(e) => {e.preventDefault(); handleClick(data.link)}}>
                      <FormattedMessage id={data.titleId}>
                        {title => <p className="bold">{title}</p>}
                      </FormattedMessage>
                      <FormattedMessage id={data.contentId}>
                        {content => <p>{content}</p>}
                      </FormattedMessage>
                    </LinkWrapper>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                {SETTING_LINKS_2.map((data) => {
                  return (
                    <LinkWrapper
                        href=""
                        key={data.id}
                        type={data.type}
                        rel="noopener noreferrer"
                        onClick={(e) => {e.preventDefault(); handleClick(data.link)}}>
                      <FormattedMessage id={data.titleId}>
                        {title => <p className="bold">{title}</p>}
                      </FormattedMessage>
                      <FormattedMessage id={data.contentId}>
                        {content => <p>{content}</p>}
                      </FormattedMessage>
                    </LinkWrapper>
                  );
                })}
              </div>


            </Block>

          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
