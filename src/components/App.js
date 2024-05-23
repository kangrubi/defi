import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";

const App = () => {
  const [state, setState] = useState({
    account: "0x0",
    daiToken: null,
    dappToken: null,
    tokenFarm: null,
    daiTokenBalance: "0",
    dappTokenBalance: "0",
    stakingBalance: "0",
    loading: true,
  });

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

  const loadBlockchainData = async () => {
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();

    setState((prevState) => ({ ...prevState, account: accounts[0] }));

    const networkId = await web3.eth.getChainId();

    // 컨트랙트 객체 생성
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );

      setState((prevState) => ({
        ...prevState,
        daiToken,
      }));
    }
  };

  const loadDaiTokenBalance = async () => {
    const { account, daiToken } = state;

    // 컨트랙트 객체의 메서드 호출
    if (daiToken && account) {
      try {
        const daiTokenBalance = await daiToken.methods
          .balanceOf(account)
          .call();

        setState((prevState) => ({
          ...prevState,
          daiTokenBalance: daiTokenBalance.toString(),
        }));
      } catch (error) {
        console.error("Error fetching DaiToken balance:", error);
      }
    }
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (state.daiToken && state.account !== "0x0") {
      loadDaiTokenBalance();
    }

    console.log(state.daiTokenBalance);
  }, [state.account, state.daiToken, state.daiTokenBalance]);

  return (
    <div>
      <Navbar account={state.account} />
    </div>
  );
};

export default App;
