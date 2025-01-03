import React from "react";
import Image from "next/image";

const Aside = () => {
  return (
    <aside className="hidden w-64 lg:block">
      <div>이 작가의 또 다른 작품 </div>
      <ul>
        <li className="flex items-center gap-1">
          <Image src="/logo.svg" alt="webtoon" width={60} height={60} />
          <div>
            <div className="text-xs">웹툰 제목</div>
            <div className="text-xs">작가명</div>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
