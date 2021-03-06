import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { groupBy } from 'lodash';
import {databaseRef, ORDER_ITEMS, ARCHIVE} from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const ArchiveList = ({archiveItems, allItems, user}) => {

    const clearArchive = () => {

        databaseRef(ARCHIVE).orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            databaseRef(ARCHIVE).update(updates);
        });

        clearOrdersArchiveId()
    };

    const clearOrdersArchiveId = () => {

        allItems.forEach((item) => {
            databaseRef(`/${ORDER_ITEMS}/${item.itemId}`).update({archiveId: 1})
        })
    }

    let sortedByArchiveId = groupBy(archiveItems, 'archiveId');
    let totalBillPrice;
    let billDate;
    let billLocation;
    let currency;

    return(
        <>
            {Object.keys(sortedByArchiveId).length > 0 &&

                <>
                    {Object.keys(sortedByArchiveId).slice(0).reverse().map((v, i) => {
                        return (
                            <Paper key={i} square style={{margin: '2%', padding: '3% 24px', display: 'flex', flexDirection: 'column-reverse'}}>
                                <div>
                                    {sortedByArchiveId[v].map((vv, ii) => {
                                        totalBillPrice = vv.totalPrice;
                                        billDate = vv.currentDate;
                                        billLocation = vv.billLocation;
                                        currency = vv.itemCurrency;
                                        return (
                                            <Typography key={ii} component="p" variant="subtitle1">
                                                {vv.itemCalculatedAmount} x {vv.itemName} = {vv.itemCalculatedPrice} {vv.itemCurrency}
                                            </Typography>
                                        )
                                    })}
                                    <Typography component="p" variant="subtitle1">
                                        total: {totalBillPrice} {currency}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography component="p" variant="subtitle1">
                                        {billDate}
                                    </Typography>
                                    {billLocation !== "Bill Location" &&
                                        <Typography component="p" variant="subtitle1">
                                            {billLocation}
                                        </Typography>
                                    }
                                </div>
                            </Paper>
                        )
                    })}

                </>
            }

            <div>
                {Object.keys(sortedByArchiveId).length === 0 &&
                    <Paper square style={{margin: '2%', padding: '3% 24px', textAlign: 'center'}}>
                        <Typography component="p" variant="subtitle1">
                            Archive is empty
                        </Typography>
                    </Paper>
                }
                <div style={{padding: '3% 24px', textAlign: 'center'}}>
                    <Fab size='small' disabled={Object.keys(sortedByArchiveId).length < 1} color='secondary' aria-label='clear archive orders' onClick={clearArchive}>
                        <DeleteForever />
                    </Fab>
                </div>
            </div>
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        allItems: state.ordersReducer,
        archiveItems: state.archiveReducer,
        user: state.userReducer.user
    }
};

export default connect(
    mapStateToProps
)(ArchiveList);

ArchiveList.propTypes = {
    archiveItems: PropTypes.array,
    allItems: PropTypes.array,
    user: PropTypes.object
};
