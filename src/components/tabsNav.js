import React, { useState } from 'react';
import Form from './form';
import OrderList from './orderList';
import ArchiveList from './archiveList';
import SettingsPage from './settings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ViewList from '@material-ui/icons/ViewList';
import Archive from '@material-ui/icons/Archive';
import Settings from '@material-ui/icons/Settings';
import Badge from '@material-ui/core/Badge';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';
import Grid from '@material-ui/core/Grid';

const TabsNav = ({archiveItems}) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue)
    };

    let sortedByArchiveId = Object.keys(groupBy(archiveItems, 'archiveId')).length;

    return(
        <>
            <Grid container justify={'center'}>
                <Grid item xs={12} md={6}>
                    <Tabs variant='fullWidth' color="primary"
                          centered
                          value={activeTab}
                          onChange={handleChange}
                    >
                        <Tab label='Orders'
                             icon={<ViewList />}
                        />
                        <Tab label={
                                <Badge style={{paddingRight: '10px'}} badgeContent={sortedByArchiveId}>
                                    Archive
                                </Badge>
                            }
                            icon={<Archive />}
                        />
                        <Tab label='Settings'
                             icon={<Settings />}
                        />
                    </Tabs>
                </Grid>
            </Grid>

            <Grid container justify={'center'}>
                <Grid item xs={12} sm={8} md={6}>
                    {activeTab === 0 && <><Form /><OrderList/></>}
                    {activeTab === 1 && <ArchiveList />}
                    {activeTab === 2 && <SettingsPage />}
                </Grid>
            </Grid>
        </>
    )
};

const mapStateToProps = (state) => {
    return {
        archiveItems: state.archiveReducer
    }
};

export default connect(
    mapStateToProps
)(TabsNav);

TabsNav.propTypes = {
    archiveItems: PropTypes.array
};
