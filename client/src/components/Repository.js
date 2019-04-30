import {Header, Segment, Grid, Image, Divider, Button} from "semantic-ui-react";
import * as PropTypes from "prop-types";
import React from "react";

// renders the marketplace
export const RepositorySegment = ({repository, contract, accounts}) => {

    let index = 0;
    repository.forEach( function(vnf) {
        vnf["index"] = index++;
        var total = 0;
        for(var i = 0; i < vnf.ratings.length; i++) {
            total += parseFloat(vnf.ratings[i]);
        }
        vnf['rating_avg'] = total === 0 ? false : total / vnf.ratings.length;
    });

    contract.once('License', {
        fromBlock: 0
    }, (error, event) => { console.log(event); });

    let buyVNF = async (index) => {
        await contract.methods.buy_VNF(index).send({ from: accounts[0],
                                                     value: repository[index].price });
    };

    return (
        <Segment>
            <Header as='h1'>VNF Package marketplace</Header>
            <Grid columns={1} divided>
                {
                    repository.length === 0 &&
                    [
                        <br/>,
                        <br/>,
                        <Header as='h3'>empty repository</Header>,
                        <br/>,
                        <br/>
                    ]
                }
                {
                    repository.map(({ index, name, description, image_link, service_type, price, rating_avg, license }) => (
                        [
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Image src={image_link} size='small' />
                                </Grid.Column>
                                <Grid.Column width={9}>
                                    <Header as='h3'>{name}</Header>
                                    <Header as='h4'>{service_type}</Header>
                                    <p>Description: {description}</p>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Header as='h3'>Rating: {rating_avg ? rating_avg.toFixed(1) : "no ratings yet"}</Header>
                                    <Header as='h4'>Price (Ether): {price / 1000000000000000000}</Header>
                                    <Button
                                        content= {license.license === true ? "Acquired" : "Acquire VNF"}
                                        onClick={(e) => buyVNF(index, e)}
                                        disabled={license.license === true}
                                    />
                                </Grid.Column>
                            </Grid.Row>,
                            <Divider/>
                        ]
                    ))
                }

            </Grid>
    </Segment>);
};

RepositorySegment.propTypes = {repository: PropTypes.arrayOf(PropTypes.any)};
