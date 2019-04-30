pragma solidity >=0.4.22 <0.6.0;
contract Repository {

  struct VNF {
    string name;
    string description;
    string image_link;
    string service_type;
    string repository_link;
    uint price;
    address payable author;
    string version;
    string requirements;
    string resources;
    bytes32 repository_hash;
    uint[] ratings;
    mapping (address => bool) licensees;
  }

  VNF[] VNF_repository;

  event License(
        address buyer,
        uint index,
        string repository_link,
        bytes32 repository_hash
  );

  function register_VNF(string memory name,
    string memory description, string memory image_link, string memory service_type,
                        string memory repository_link, uint price, string memory version, string memory requirements, string memory resources,
                        bytes32 repository_hash) public {

    address payable author = msg.sender;
    VNF memory vnf = VNF(name, description, image_link, service_type, repository_link,
                             price, author, version, requirements, resources, repository_hash, new uint[](0));

    VNF_repository.push(vnf);
  }

  function update_VNF(uint index, string memory name, string memory description, string memory image_link, string memory service_type,
                        string memory repository_link, uint price, string memory version, string memory requirements, string memory resources,
                        bytes32 repository_hash) public {
    require(msg.sender == VNF_repository[index].author, "Only author can update VNF package");
    VNF_repository[index].name = name;
    VNF_repository[index].description = description;
    VNF_repository[index].image_link = image_link;
    VNF_repository[index].service_type = service_type;
    VNF_repository[index].repository_link = repository_link;
    VNF_repository[index].price = price;
    VNF_repository[index].version = version;
    VNF_repository[index].requirements = requirements;
    VNF_repository[index].resources = resources;
    VNF_repository[index].repository_hash = repository_hash;
  }

  function retrieve_numberOf_vnf() public view returns (uint count) {
    count = VNF_repository.length;
  }

  function retrieve_vnf(uint index) public view returns
  (string memory name, string memory description, string memory image_link, string memory service_type,
   uint price, address author, string memory version, uint[] memory ratings) {
     name = VNF_repository[index].name;
     description = VNF_repository[index].description;
     image_link = VNF_repository[index].image_link;
     service_type = VNF_repository[index].service_type;
     price = VNF_repository[index].price;
     author = VNF_repository[index].author;
     version = VNF_repository[index].version;
     ratings = VNF_repository[index].ratings;
  }

  function retrieve_vnf_requirements(uint index) public view returns
  (string memory requirements, string memory resources) {
     requirements = VNF_repository[index].requirements;
     resources = VNF_repository[index].resources;
  }

  function has_VNF_license(uint index) public view returns
  (bool license) {
     license = VNF_repository[index].licensees[msg.sender];
  }

  function get_licensed_VNF(uint index) public view returns
  (string memory repository_link, bytes32 repository_hash) {
     require(VNF_repository[index].licensees[msg.sender] == true,
       "No license acquired for specified VNF");
     repository_link = VNF_repository[index].repository_link;
     repository_hash = VNF_repository[index].repository_hash;
  }

  function delete_VNF(uint index) public {
    VNF_repository[index] = VNF_repository[VNF_repository.length-1];
    delete VNF_repository[VNF_repository.length-1];
    VNF_repository.length--;
  }

  function buy_VNF(uint index) public payable {
    require(msg.value == VNF_repository[index].price, "price and value do not match");
    address payable receiver = VNF_repository[index].author;
    uint amount = VNF_repository[index].price;
    receiver.transfer(amount);
    VNF_repository[index].licensees[msg.sender] = true;
    emit License(msg.sender, index, VNF_repository[index].repository_link, VNF_repository[index].repository_hash);
  }

  function rate_VNF(uint index, uint rating) public {
    require(rating <= 10, "Rating scale is 1-10");
    require(rating >= 1, "Rating scale is 1-10");
    require(VNF_repository[index].licensees[msg.sender] == true,
      "Rating only possible for licensees");
    VNF_repository[index].ratings.push(rating);
  }
}
