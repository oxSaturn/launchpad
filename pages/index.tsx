import Image from "next/image";
import type { NextPage } from "next";

import { Launchpad } from "../components/Launchpad";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="mx-5 flex max-h-[312px] items-center justify-center overflow-y-hidden lg:mx-0">
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
