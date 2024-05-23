import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Main from "./Main";

const App = () => {
  const [state, setState] = useState({
    account: "0x0",
    daiToken: null,
    dappToken: null,
    tokenFarm: null,
    daiTokenBalance: "0",
    dappTokenBalance: "0",
    stakingBalance: "0",
  });
  const [loading, setLoading] = useState(true);

  const {
    account,
    daiToken,
    daiTokenBalance,
    dappToken,
    dappTokenBalance,
    tokenFarm,
    stakingBalance,
  } = state;

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        // 사용자의 이더리움 계정에 접근 권한 요청
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Web3 인스턴스 초기화
        window.web3 = new Web3(window.ethereum);
      } catch {
        console.error("사용자가 접근 권한을 거부했습니다:");
      }
    } else if (window.web3) {
      // 레거시 dApp 브라우저 지원
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadContract = async (web3, contractJson, networkId) => {
    const contractData = contractJson.networks[networkId];
    if (contractData) {
      return new web3.eth.Contract(contractJson.abi, contractData.address);
    } else {
      alert(
        `${contractJson.contractName} contract not deployed to detected network.`
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();

    setState((prevState) => ({ ...prevState, account: accounts[0] }));

    const networkId = await web3.eth.getChainId();

    // 컨트랙트 객체 생성
    const daiToken = await loadContract(web3, DaiToken, networkId);
    const dappToken = await loadContract(web3, DappToken, networkId);
    const tokenFarm = await loadContract(web3, TokenFarm, networkId);

    setState((prevState) => ({
      ...prevState,
      daiToken,
      dappToken,
      tokenFarm,
    }));
    setLoading(false);
  };

  const loadBalance = async (token, account) => {
    if (token && account) {
      try {
        if (token.methods.balanceOf) {
          return await token.methods.balanceOf(account).call();
        } else if (token.methods.stakingBalance) {
          return await token.methods.stakingBalance(account).call();
        }
      } catch (error) {
        alert(
          `${token.contractName} contract not deployed to detected network.`
        );
        return;
      }
    }
  };

  const loadTokenBalance = async () => {
    // 컨트랙트 객체의 메서드 호출
    const daiTokenBalance = await loadBalance(daiToken, account);
    const dappTokenBalance = await loadBalance(dappToken, account);
    const stakingBalance = await loadBalance(tokenFarm, account);

    setState((prevState) => ({
      ...prevState,
      daiTokenBalance: daiTokenBalance ? daiTokenBalance.toString() : "0",
      dappTokenBalance: dappTokenBalance ? dappTokenBalance.toString() : "0",
      stakingBalance: stakingBalance ? stakingBalance.toString() : "0",
    }));

    setLoading(false);
  };

  const stakeTokens = async (amount) => {
    setLoading(true);

    try {
      // 1단계: TokenFarm 컨트랙트가 사용자의 Dai 토큰을 사용할 수 있도록 승인
      await daiToken.methods
        .approve(tokenFarm._address, amount)
        .send({ from: account })
        .on("transactionHash", async (hash) => {
          // 2단계: Dai 토큰을 TokenFarm 컨트랙트에 스테이킹
          await tokenFarm.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on("transactionHash", async (hash) => {
              setLoading(false);
            });
        });
    } catch {
      alert("Error staking tokens");
      setLoading(false);
    }
  };

  const unStakeTokens = async () => {
    setLoading(true);

    console.log(tokenFarm);

    try {
      await tokenFarm.methods
        .unstakeTokens()
        .send({ from: account })
        .on("transactionHash", async (hash) => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      alert("Error unStaking tokens");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (account !== "0x0" && daiToken && dappToken && tokenFarm)
      loadTokenBalance();
  }, [
    account,
    daiToken,
    dappToken,
    tokenFarm,
    daiTokenBalance,
    dappTokenBalance,
    stakingBalance,
  ]);

  return (
    <div>
      <Navbar account={state.account} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {loading ? (
                <p id="loader" className="text-center">
                  Loading...
                </p>
              ) : (
                <Main
                  daiTokenBalance={daiTokenBalance}
                  dappTokenBalance={dappTokenBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unStakeTokens={unStakeTokens}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
