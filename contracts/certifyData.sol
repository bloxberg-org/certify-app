pragma solidity ^0.4.4;

import "./zeppelin/math/SafeMath.sol";

contract certifyResearchData {

  struct Researcher{
   string institution;
   string name;
 }

// ============================ Master Research Data =====================

uint numResearchData;
    struct ResearchData {
    string checksum;
    string researchauthor;
    //string txhash;
    bytes32 researchID;
    string timestamp;
    bool checksumexists;
   //mapping (string => Researcher) researchers;
    }
    bytes32[] researchDataIdentifiers;
    bytes32[] txIDs;
    mapping (bytes32 => ResearchData) researchdatas;
 
 event createDataEvent(bytes32 ID, bool returnValue);
 
 function createData(string StringCheckSum, bool DataExists, string researchauthor, string timestamp) 
 public
 payable 
 returns(bytes32 researchID){
    //generates unique dataID using timestamp and checksum of data
    bytes32 dataID = keccak256(StringCheckSum, timestamp);
      researchDataIdentifiers.push(dataID);
      numResearchData = numResearchData++;
      researchdatas[dataID].checksum = StringCheckSum;
      researchdatas[dataID].researchID = dataID;
      researchdatas[dataID].researchauthor = researchauthor;
      researchdatas[dataID].timestamp = timestamp;
      researchdatas[dataID].checksumexists = DataExists;
      createDataEvent(dataID, true);
    return dataID;
    }

function getResearchDataIdentifiers()
public
view
returns (bytes32[]) {
  return researchDataIdentifiers;
}
//instead of input researchtitle, we could use username of user.
function retrieveResearchData(bytes32 researchdataID)
public 
view
//Re-add another string if txhash is required
returns(string, string, bytes32, string, bool) {
return(
    researchdatas[researchdataID].checksum,
    researchdatas[researchdataID].researchauthor,
    //researchdatas[dataID].txhash,
    researchdatas[researchdataID].researchID,
    researchdatas[researchdataID].timestamp,
    researchdatas[researchdataID].checksumexists
    );
}


// ============================ IPFS Hash Storage =========================
 
 string ipfsHash;
 
 function sendHash(string x) public {
   ipfsHash = x;
 }

 function getHash() public view returns (string x) {
   return ipfsHash;
 }
 
}
