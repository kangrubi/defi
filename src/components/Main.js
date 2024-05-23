import React, { useRef } from "react";
import dai from "../dai.png";

const Main = ({
  daiTokenBalance,
  dappTokenBalance,
  stakingBalance,
  stakeTokens,
  unStakeTokens,
}) => {
  const amountRef = useRef();

  const handleStake = (event) => {
    event.preventDefault();

    const target = amountRef.current.value;
    const amount = window.web3.utils.toWei(target, "Ether");

    stakeTokens(amount);
  };

  const handleUnStake = (event) => {
    event.preventDefault();

    unStakeTokens();
  };

  return (
    <div>
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(stakingBalance, "Ether")}
                mDAI
              </td>
              <td>
                {window.web3.utils.fromWei(dappTokenBalance, "Ether")}
                DAPP
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={handleStake}>
              <div>
                <label className="float-left">
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(daiTokenBalance, "Ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                  ref={amountRef}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                STAKE!
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={handleUnStake}
            >
              UN-STAKE...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
