import React, {Component} from "react";
import {Header, Segment, Grid, Image, Divider, Button, Modal, Icon} from "semantic-ui-react";
import Rating from 'react-rating';
import feedback from './img/feedback.jpg'
import license_img from './img/license.png'


// renders the Account tab
class AccountSegment extends Component {
    constructor(props) {
      super(props);
      this.state =
          {
              'showModal': false,
              'showLicense': false,
              'license': false,
              'rating': false,
          };

    }

    rate_VNF = async (index) => {
      const {contract, accounts} = this.props;
      this.setState({showModal: false});
      if (this.state.rating !== false ) {
            await contract.methods.rate_VNF(index, this.state.rating).send({ from: accounts[0]});
        }
    };

    request_license = async (index) => {
        const {contract} = this.props;
        let license = await contract.methods.get_licensed_VNF(index).call();
        console.log(license);
        this.setState({license: license, showLicense: true})
    }

    render() {
      const {repository} = this.props;
      return (
        <Segment>
            <Header as='h1'>My licensed VNF packages</Header>
            <Grid columns={1} divided>
                {
                    repository.filter(i => i.license.license === true).map(({ index, name, description, image_link, service_type, price, version, requirements, resources, license }) => (
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
                                    <Modal onClose={() => this.setState({ showModal: index })} open={this.state.showModal === index} trigger={<Button  onClick={() => this.setState({ showModal: index })}>Rate</Button>}>
                                        <Modal.Header>Rate this package</Modal.Header>
                                        <Modal.Content image>
                                            <Image wrapped size='medium' src={feedback} />
                                            <Modal.Description>
                                                <br/><br/><br/>
                                                <Header>Rate image on a scale from 1 - 10</Header>
                                                <Rating emptySymbol={<Icon name="star outline" />}
                                                        fullSymbol={<Icon name="star" />}
                                                        stop={10}
                                                        onChange={(value) => this.setState({rating: value}) }
                                                        initialRating = {this.state.rating}/>
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={(e) => this.rate_VNF(index, e)}>
                                                <Icon name='checkmark' /> Submit
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                    <Button onClick={(e) => this.request_license(index)}>Request license</Button>
                                    <Modal onClose={() => this.setState({ showLicense: false })} open={this.state.showLicense}>
                                        <Modal.Header>License details</Modal.Header>
                                        <Modal.Content image>
                                            <Image wrapped size='medium' src={license_img} />
                                            <Modal.Description>
                                                <br/><br/><br/>
                                                <Header>License details:</Header>
                                                <Header as='h4'>Repository Link:<br/>{this.state.license ? this.state.license.repository_link : "fetching"}</Header>
                                                <Header as='h4'>Hash (SHA-256):<br/>{this.state.license ? this.state.license.repository_hash : "fetching"}</Header>

                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={(e) => this.setState({showLicense: false})}>
                                                <Icon name='close' /> Close
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Grid.Column>
                            </Grid.Row>,
                            <Divider/>
                        ]
                    ))
                }

                {
                    repository.filter(i => i.license.license === true).length === 0 &&
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Header as='h3'>No licenses available</Header>
                        </Grid.Column>
                    </Grid.Row>

                }

            </Grid>
    </Segment>);
  }


};


export default AccountSegment;
