import Image from "next/image";
import type { NextPage } from "next";

import { Launchpad } from "../components/Launchpad";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex max-h-[312px] items-center justify-center overflow-y-hidden">
        <Image
          alt="sanko dream machine"
          src="/sanko.png"
          width={960}
          height={375}
          layout="fixed"
        />
      </div>
      <Launchpad />
    </div>
  );
};

export default Home;
