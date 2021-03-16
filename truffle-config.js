require("babel-register");
require("babel-polyfill");
require("dotenv").config();




module.exports = {


  
  networks: {
    development : {
      host : "127.0.0.1",
      port : 7545,
      network_id : "*"
    }
  },

  contracts_directory : "./src/contracts",
  contracts_build_directory : "./src/abis",
  // Set default mocha options here, use special reporters etc.
  

  // Configure your compilers
  compilers: {
    solc: {
     version : "0.7.4",
       optimizer: {
         enabled: true,
         runs: 200
       },
     
    },
  },
};
