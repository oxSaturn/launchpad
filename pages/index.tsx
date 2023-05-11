import Image from "next/image";
import type { NextPage } from "next";

import { Launchpad } from "../components/Launchpad";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <Image
        alt="sanko dream machine"
        src="/sanko.png"
        width={350}
        height={248}
        layout="fixed"
      />

      <Launchpad />
    </div>
  );
};

export default Home;
