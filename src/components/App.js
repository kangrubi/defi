import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";

const App = () => {
  const [state, setState] = useState({
    account: "0x0",
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

    console.log(accounts);
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navbar account={state.account} />
    </div>
  );
};

export default App;
