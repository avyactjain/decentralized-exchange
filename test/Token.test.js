const { default: Web3 } = require("web3")
import { EVM_REVERT, tokens } from './helpers';

const Token = artifacts.require("./Token")

require("chai")
    .use(require("chai-as-promised"))
    .should()







contract("Token", ([deployer, receiver, exchange]) => {
    let token;
    const totalSupply = tokens(1000000).toString()

    beforeEach(async () => {
        token = await Token.new()
    })
    describe("deployment", () => {
        it("tracks the name", async () => {
            const result = await token.name()
            result.should.equal("CryptoTalk Token")
        })
        it("tracks the symbol", async () => {

            const result = await token.symbol()
            result.should.equal("CTN")
        })

        it("tracks the decimals", async () => {

            const result = await token.decimals()
            console.log(result);
            result.toString().should.equal("18")
        })

        it("tracks the total supply", async () => {
            const result = await token.totalSupply()
            result.toString().should.equal("1000000000000000000000000")
        })

        it('assigns the total supply to the deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })

    })

    describe('sending tokens', () => {

        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100)
            result = await token.transfer(receiver, amount, { from: deployer })


        })



        it('transfers token balances', async () => {
            let balanceOf
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString())
            balanceOf = await token.balanceOf(receiver)
            balanceOf.toString().should.equal(tokens(100).toString())
        })

        it("emits a transfer event", async () => {
            const log = result.logs[0];

            log.event.should.equal("Transfer")
            const event = log.args
            event.from.toString().should.equal(deployer, "from is correct")
            event.to.toString().should.equal(receiver, "receiver is correct")
            event.value.toString().should.equal(amount.toString(), "amount is correct")
        })
        describe("success", async () => {



        })

        describe("failure", async () => {

            it('rejects insufficient balances', async () => {
                let invalidAmount
                invalidAmount = tokens(100000000) // 100 million - greater than total supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

                // Attempt transfer tokens, when you have none
                invalidAmount = tokens(10) // recipient has no tokens
                await token.transfer(deployer, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT)
            })

            // it("rejects insufficient balances", async () => {
            //     let invalidAmount
            //     invalidAmount = tokens(1000000000) //100 mil - greater than total supply
            //     await token.transfer(deployer, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

            //     console.log(receiver);
            //     console.log(deployer);
            //     invalidAmount = tokens(10)
            //     await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
            // })

            it("rejects invalid recipients", async () => {
                await token.transfer(0x0, tokens(10), { from: deployer }).should.be.rejected;
            })

        })

    })


    describe('approving tokens', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100)
            result = await token.approve(exchange, amount, { from: deployer })
        })


        describe("success", () => {

            it("allocates an allowance for delegated token spending", async () => {
                const allowance = await token.allowance(deployer, exchange)

                allowance.toString().should.equal(amount.toString())
            })

            // it("approves a token", async ()=>{
            //     const approved = await token.approve(deployer,amount, {from:deployer})
            //     approved.should.equal(true);
            // })

            it("emits a Approval event", async () => {
                const log = result.logs[0];

                log.event.should.equal("Approval")
                const event = log.args
                // console.log(event);

                event.owner.toString().should.equal(deployer, "from is correct")
                event.spender.toString().should.equal(exchange, "spender is correct")
                event.amount.toString().should.equal(amount.toString(), "amount is correct")
            })



        })

        describe("success", () => {

        })
    })




    describe('delegated token transfers', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100)
            await token.approve(exchange, amount, { from: deployer })
            result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
        })


        describe("success", () => {

            it("transfer token balances", async () => {
                let balanceOf
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString());
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString());


            })

            it("Resets the allowance", async () => {
                const allowance = await token.allowance(deployer, exchange)

                allowance.toString().should.equal("0")
            })

            it("emits a transfer event", async () => {
                const log = result.logs[0];

                log.event.should.equal("Transfer")
                const event = log.args
                event.from.toString().should.equal(deployer, "from is correct")
                event.to.toString().should.equal(receiver, "receiver is correct")
                event.value.toString().should.equal(amount.toString(), "amount is correct")
            })



        })

        describe('failure', () => {
            it('rejects insufficient amounts', () => {
                // Attempt transfer too many tokens
                const invalidAmount = tokens(100000000)
                token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT)
            })

            it('rejects invalid recipients', () => {
                token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
            })
        })



    })



})