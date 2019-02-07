pragma solidity >=0.4.22 <0.6.0;
contract Repository {

  struct VNF {
    string name;
    string description;
    string service_type;
    string repository_link;
    uint price;
    address payable author;
    string version;
    bytes32 repository_hash;
  }

  VNF[] VNF_repository;

  function register_VNF(string memory name, string memory description, string memory service_type,
                        string memory repository_link, uint price, string memory version,
                        bytes32 repository_hash) public {

    address payable author = msg.sender;
    VNF memory vnf = VNF(name, description, service_type, repository_link,
                             price, author, version, repository_hash);

    VNF_repository.push(vnf);
  }

  function retrieve_numberOf_vnf() public view returns (uint count) {
    count = VNF_repository.length;
  }

  function retrieve_vnf(uint index) public view returns
  (string memory name, string memory description, string memory service_type, string memory repository_link,
   uint price, address author, string memory version, bytes32 repository_hash) {
     name = VNF_repository[index].name;
     description = VNF_repository[index].description;
     service_type = VNF_repository[index].service_type;
     repository_link = VNF_repository[index].repository_link;
     price = VNF_repository[index].price;
     author = VNF_repository[index].author;
     version = VNF_repository[index].version;
     repository_hash = VNF_repository[index].repository_hash;
  }

  function delete_VNF(uint index) public {
    VNF_repository[index] = VNF_repository[VNF_repository.length-1];
    delete VNF_repository[VNF_repository.length-1];
    VNF_repository.length--;
  }

  function buy_VNF(uint index) public payable {
    require(msg.value == VNF_repository[index].price, "Price is higher than sent value");
    address payable receiver = VNF_repository[index].author;
    uint amount = VNF_repository[index].price;
    receiver.transfer(amount);
  }
}
