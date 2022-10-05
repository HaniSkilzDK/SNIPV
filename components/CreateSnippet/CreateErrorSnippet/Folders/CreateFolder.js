import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRecoilState, useRecoilValue } from "recoil";
import { createCodeFolderModalState } from "../../../../atoms/createCodeFolderModalAtom";
import CreateMainFolder from "./CreateMainFolder";
import CreateSubFolder from "./CreateSubFolder";

const CreateFolder = () => {
  const tabOpen = useRecoilValue(createCodeFolderModalState)
  return (
    <div>
      <div>
        {tabOpen.view == 0 && (
            <CreateMainFolder />
        )}

        {tabOpen.view == 1 && (
            <CreateSubFolder />
        )}
      </div>
    </div>
  );
};

export default CreateFolder;