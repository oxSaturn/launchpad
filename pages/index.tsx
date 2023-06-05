import Image from "next/image";
import type { NextPage } from "next";

import { Launchpad } from "../components/Launchpad";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div>Velocimeter Multichain Launchpad</div>
      <div>FLOW Pulsechain</div>
      <Launchpad />
    </div>
  );
};

export default Home;
