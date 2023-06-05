import Image from "next/image";
import type { NextPage } from "next";

import { Launchpad } from "../components/Launchpad";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex max-h-[312px] items-center justify-center overflow-y-hidden">
        <Image
          alt="Velocimeter V3"
          src="/images/long.png"
          width={1150}
          height={170}
          layout="intrinsic"
        />
      </div>
      <Launchpad />
    </div>
  );
};

export default Home;
