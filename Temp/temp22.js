import React, { useMemo, useState } from "react";
import {
  Input,
  Spacer,
  Textarea,
  Button,
  Dropdown,
  Collapse,
  Text,
} from "@nextui-org/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase/clientApp";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { TagsInput } from "react-tag-input-component";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useRecoilState } from "recoil";
import { createFolderModalState } from "../atoms/createFolderModalAtom";
import CreatedFolders from "../components/Upsert/CreatedFolders";

const initialState = {
  title: "",
  description: "",
  code: "",
};

const initialSelectedFolderValue = {
  label: "",
  value: "",
  langId: 0,
};

const Upsert = () => {
  /*   const [open, setOpen] = useRecoilState(createFolderModalState); */
  const [form, setForm] = useState(initialState);
  const [tags, setTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(
    initialSelectedFolderValue
  );
  const [selectedCategory, setSelectedCategory] = useState([]);

  const { title, description, code } = form;

  const [user] = useAuthState(auth);

  /*   const { id } = useRouter(); */
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description && code) {
      try {
        await addDoc(collection(db, "SnippetsData"), {
          ...form,
          postedAt: serverTimestamp(),
          author: user.displayName,
          userId: user.uid,
          category: selectedCategory,
          folder: selectedFolder,
          tags: tags,
        });
        router("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      /* return toast.error("All fields are mandatory to fill!"); */
    }
  };
  return (
    <div>
      <div className="">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="w-full pt-8">
              <Input
                clearable
                underlined
                labelPlaceholder="Titel *"
                name="title"
                value={title}
                size="lg"
                onChange={handleChange}
                required
              />
              <Spacer y={1.7} />
              <Input
                clearable
                underlined
                labelPlaceholder="Beskrivelse"
                name="description"
                value={description}
                size="lg"
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <CreatedFolders
                setSelectedFolder={setSelectedFolder}
                selectedFolder={selectedFolder}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
          <Spacer y={1.5} />
          <div>
          <Text>Din kode</Text>
            <Spacer y={0.3} />
            <Textarea
              placeholder="her..."
              name="code"
              value={code}
              onChange={handleChange}
              css={{ height: "auto" }}
              size="lg"
              cacheMeasurements
              width="100%"
              height="100%"
            />
          </div>
          <Spacer y={1} />
          <div>
            <Collapse title={<Text b>Kode forhåndsvisning</Text>}>
              <SyntaxHighlighter language="javascript" style={oneLight}>
                {form.code}
              </SyntaxHighlighter>
            </Collapse>
          </div>
          <Spacer y={1.5} />
          {/* MODAL OPEN */}
          {/* <Button onClick={() => setOpen(true)}>Open</Button> */}
          <TagsInput
            value={tags}
            onChange={setTags}
            name="tags"
            placeHolder="tags"
          />
          <Spacer y={1.5} />
          <Button color="primary" type="submit">
            Gem
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Upsert;