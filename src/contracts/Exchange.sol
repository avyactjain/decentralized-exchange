pragma solidity ^0.7.4;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";

//Deposit & Withdraw funds
//Manage orders, make or cancel
//Handle trades, charge fees

//TODO:
// Set the fee and fee account - Done
// Deposit Ether - Done
// Withdraw Ether
// Deposit Tokens - Done
// Withdraw Tokens
// Check balances
// Make order
// Cancel order
// Fill order
// Charge fees

contract Exchange {
    using SafeMath for uint256;
    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0);
    mapping(address => mapping(address => uint256)) public tokens; // {token : {user : balance}}

    //Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    fallback() external payable {
        revert();
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        // Which token?
        // How much?
        // Send tokens to this contract
        // Manage deposit - update balance
        // Emit event

        //Dont allow eth deposit
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}
