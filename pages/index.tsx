import Image from "next/image";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <Image
        alt="sanko dream machine"
        src="/sanko.png"
        width={350}
        height={248}
      />
      <div className="flex flex-col gap-3">
        <div className="flex items-center">line</div>
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <div>Buy</div>
            <input />
            <div> align end absolute balance</div>
            <div>
              <div>Spent</div>
              <div>0.00</div>
            </div>
            <div>
              <div>Allocation</div>
              <div>0.00</div>
            </div>
            <button>Approbe Buy Claim</button>
          </div>
          <div>graph</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
