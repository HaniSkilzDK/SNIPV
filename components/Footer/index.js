import { Text } from "@nextui-org/react";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="max-w-5xl mx-5 lg:mx-auto mt-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="cursor-pointer">
            <Link href="/about">
              <Text small b color="black">
                Om SNIPV
              </Text>
            </Link>
          </div>
          <div>
            <Text small color="black">
              Databeskyttelsespolitik
            </Text>
          </div>
          <div>
            <Text small color="black">
            Cookiepolitik
            </Text>
          </div>
        </div>
        <div className="text-center">
          <Text small>© 2022 SNIPV</Text>
        </div>
        <div className="">
          <Text small>beta 0.2</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
